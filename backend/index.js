require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("./models/admin"); 


// Models
const Conversation = require("./models/conversation");
const Message = require("./models/message");

// Initialize Express
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  "/widget",
  express.static(path.join(__dirname, ".", "public", "widget"))
);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

// Socket.IO connection
io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);

  socket.on(
    "join_conversation",
    async ({ conversationId, visitorId, metadata }) => {
      console.log(`Client ${socket.id} joined conversation: ${conversationId}`);

      socket.join(conversationId);

      let conversation;

      if (conversationId === "new") {
        const newId = uuidv4();
        conversation = new Conversation({
          _id: newId,
          visitorId,
          startedAt: new Date(),
          lastMessageAt: new Date(),
          metadata,
        });
        await conversation.save();
        conversationId = newId;
      } else {
        conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          conversation = new Conversation({
            _id: conversationId,
            visitorId,
            startedAt: new Date(),
            lastMessageAt: new Date(),
            metadata,
          });
          await conversation.save();
        }
      }

      socket.emit("conversation_joined", { conversationId: conversation._id });

      const messages = await Message.find({
        conversationId: conversation._id,
      }).sort("timestamp");

      socket.emit("previous_messages", { messages });
    }
  );

  socket.on("send_message", async (data) => {
    try {
      const { conversationId, content, sender, visitorId } = data;

      const message = new Message({
        conversationId,
        content,
        sender,
        timestamp: new Date(),
      });
      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
        visitorId,
      });

      io.to(conversationId).emit("receive_message", message);

      if (sender === "user") {
        try {
          const result = await model.generateContent([content]); // FIXED
          const aiResponse = result.response.text();

          const aiMessage = new Message({
            conversationId,
            content: aiResponse,
            sender: "ai",
            timestamp: new Date(),
          });
          await aiMessage.save();

          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessageAt: new Date(),
          });

          io.to(conversationId).emit("receive_message", aiMessage);
        } catch (aiError) {
          console.error("Error generating AI response:", aiError);

          const errorMessage = new Message({
            conversationId,
            content:
              "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
            sender: "system",
            timestamp: new Date(),
          });
          await errorMessage.save();

          io.to(conversationId).emit("receive_message", errorMessage);
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", { message: "Failed to process message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// API Endpoints
app.get("/api/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ lastMessageAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

app.get("/api/conversations/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    const messages = await Message.find({ conversationId: req.params.id }).sort(
      "timestamp"
    );

    res.json({ conversation, messages });
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    res.status(500).json({ error: "Failed to fetch conversation details" });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentConversations = await Conversation.countDocuments({
      startedAt: { $gte: sevenDaysAgo },
    });

    const dailyCounts = await Conversation.aggregate([
      { $match: { startedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$startedAt" },
            month: { $month: "$startedAt" },
            day: { $dayOfMonth: "$startedAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    const chartData = dailyCounts.map((item) => ({
      date: `${item._id.year}-${item._id.month}-${item._id.day}`,
      conversations: item.count,
    }));

    res.json({
      totalConversations,
      totalMessages,
      recentConversations,
      chartData,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const messages = await Message.find({
      content: { $regex: query, $options: "i" },
    });

    const conversationIds = [
      ...new Set(messages.map((msg) => msg.conversationId)),
    ];

    const conversations = await Conversation.find({
      _id: { $in: conversationIds },
    }).sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error searching conversations:", error);
    res.status(500).json({ error: "Failed to search conversations" });
  }
});

// Test Gemini connection (optional debug endpoint)
app.get("/test-ai", async (req, res) => {
  try {
    const result = await model.generateContent(["Test message from backend"]);
    const text = result.response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Gemini AI test failed");
  }
});


app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      admin: { email: admin.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/admin/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
