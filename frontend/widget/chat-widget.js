(function () {
  // Generate a unique visitor ID or retrieve from localStorage
  function getVisitorId() {
    let visitorId = localStorage.getItem("chat_widget_visitor_id");
    if (!visitorId) {
      visitorId =
        "visitor_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_widget_visitor_id", visitorId);
    }
    return visitorId;
  }

  // Get or create a conversation ID from localStorage
  function getConversationId() {
    return localStorage.getItem("chat_widget_conversation_id") || "new";
  }

  // Save conversation ID to localStorage
  function saveConversationId(id) {
    localStorage.setItem("chat_widget_conversation_id", id);
  }

  // Format time for display
  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Create Widget CSS
  const styles = `
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    #chat-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: #111111;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }

    #chat-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
      background-color: #000000;
    }

    #chat-widget-button svg {
      width: 28px;
      height: 28px;
      stroke: white;
    }

    #chat-widget-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background-color: #1A1A1A;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      border: 1px solid #333333;
    }

    #chat-widget-window.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    #chat-widget-header {
      background-color: #111111;
      color: white;
      padding: 15px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #333333;
    }

    #chat-widget-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    #chat-widget-close:hover {
      opacity: 1;
    }

    #chat-widget-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: #FFFFFF;
    }

    .chat-message {
      padding: 10px 15px;
      border-radius: 18px;
      max-width: 80%;
      word-break: break-word;
      animation: fadeIn 0.3s ease;
      position: relative;
    }

    .chat-message .timestamp {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 4px;
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chat-message.user {
      background-color: #111111;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .chat-message.user .timestamp {
      text-align: right;
    }

    .chat-message.ai {
      background-color: #333333;
      color: #FFFFFF;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .chat-message.system {
      background-color: #2D2D2D;
      color: #FFA07A;
      align-self: center;
      border-radius: 8px;
      font-size: 0.85em;
      text-align: center;
      width: 90%;
    }

    .chat-message.system .timestamp {
      text-align: center;
    }

    #chat-widget-input-area {
      padding: 15px;
      border-top: 1px solid #333333;
      display: flex;
      gap: 10px;
      background-color: #1A1A1A;
    }

    #chat-widget-input {
      flex: 1;
      border: 1px solid #333333;
      border-radius: 20px;
      padding: 10px 15px;
      font-size: 14px;
      outline: none;
      background-color: #2D2D2D;
      color: white;
    }

    #chat-widget-input:focus {
      border-color: #444444;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
    }

    #chat-widget-input::placeholder {
      color: #888888;
    }

    #chat-widget-send {
      background-color: #111111;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 15px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    #chat-widget-send:hover {
      background-color: #000000;
    }

    #chat-widget-loading {
      display: flex;
      padding: 15px;
      justify-content: center;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background-color: #444444;
      border-radius: 50%;
      animation: typing 1s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @media screen and (max-width: 480px) {
      #chat-widget-window {
        width: calc(100vw - 40px);
        height: 60vh;
      }
    }

    /* Custom scrollbar for webkit browsers */
    #chat-widget-messages::-webkit-scrollbar {
      width: 6px;
    }

    #chat-widget-messages::-webkit-scrollbar-track {
      background: #1A1A1A;
    }

    #chat-widget-messages::-webkit-scrollbar-thumb {
      background: #333333;
      border-radius: 3px;
    }

    #chat-widget-messages::-webkit-scrollbar-thumb:hover {
      background: #444444;
    }
  `;

  // Create stylesheet
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);

  // Create Chat Widget Button
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "chat-widget-container";

  const chatButton = document.createElement("div");
  chatButton.id = "chat-widget-button";
  chatButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
    </svg>
  `;

  // Create Chat Widget Window
  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-widget-window";

  chatWindow.innerHTML = `
    <div id="chat-widget-header">
      <span>Chat Support</span>
      <button id="chat-widget-close">×</button>
    </div>
    <div id="chat-widget-messages"></div>
    <div id="chat-widget-input-area">
      <input id="chat-widget-input" type="text" placeholder="Type your message..." />
      <button id="chat-widget-send">Send</button>
    </div>
  `;

  // Add components to DOM
  widgetContainer.appendChild(chatButton);
  widgetContainer.appendChild(chatWindow);
  document.body.appendChild(widgetContainer);

  // Get DOM elements
  const chatMessages = document.getElementById("chat-widget-messages");
  const chatInput = document.getElementById("chat-widget-input");
  const chatSend = document.getElementById("chat-widget-send");
  const chatClose = document.getElementById("chat-widget-close");

  // Socket.io script
  const script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
  document.head.appendChild(script);

  let socket;
  let visitorId = getVisitorId();
  let conversationId = getConversationId();
  let isConnectionEstablished = false;
  let isWaitingForResponse = false;

  // Initialize Socket.IO when script loads
  script.onload = function () {
    // Connect to server
    socket = io("http://localhost:5000");

    socket.on("connect", function () {
      console.log("Connected to chat server");
      isConnectionEstablished = true;

      // Join conversation
      socket.emit("join_conversation", {
        conversationId,
        visitorId,
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          pageUrl: window.location.href,
        },
      });
    });

    socket.on("conversation_joined", function (data) {
      conversationId = data.conversationId;
      saveConversationId(conversationId);

      // Welcome message if it's a new conversation
      if (
        conversationId !== "new" &&
        !localStorage.getItem("welcomed_" + conversationId)
      ) {
        localStorage.setItem("welcomed_" + conversationId, "true");
        setTimeout(() => {
          addMessage("Welcome! How can I help you today?", "ai", new Date());
        }, 1000);
      }
    });

    socket.on("previous_messages", function (data) {
      chatMessages.innerHTML = "";
      data.messages.forEach((msg) => {
        addMessage(msg.content, msg.sender, new Date(msg.timestamp));
      });

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on("receive_message", function (message) {
      if (message.sender !== "user") {
        hideTypingIndicator();
        isWaitingForResponse = false;
        addMessage(
          message.content,
          message.sender,
          new Date(message.timestamp)
        );
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.disabled = false;
        chatSend.disabled = false;
      }
    });

    socket.on("error", function (error) {
      console.error("Socket error:", error);
      hideTypingIndicator();
      isWaitingForResponse = false;
      addMessage(
        "Connection error. Please refresh the page and try again.",
        "system",
        new Date()
      );
      chatInput.disabled = false;
      chatSend.disabled = false;
    });

    socket.on("disconnect", function () {
      console.log("Disconnected from chat server");
      isConnectionEstablished = false;
      hideTypingIndicator();
      isWaitingForResponse = false;
      addMessage(
        "Connection lost. Please refresh the page.",
        "system",
        new Date()
      );
      chatInput.disabled = false;
      chatSend.disabled = false;
    });
  };

  // Add message to chat
  function addMessage(content, sender, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    messageElement.innerHTML = `
      ${content}
      <span class="timestamp">${formatTime(timestamp)}</span>
    `;
    chatMessages.appendChild(messageElement);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Add typing indicator
  function showTypingIndicator() {
    hideTypingIndicator(); // Remove any existing indicator first
    const loadingElement = document.createElement("div");
    loadingElement.id = "chat-widget-loading";
    loadingElement.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Remove typing indicator
  function hideTypingIndicator() {
    const loadingElement = document.getElementById("chat-widget-loading");
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  // Send message
  function sendMessage() {
    const content = chatInput.value.trim();
    if (content !== "" && !isWaitingForResponse) {
      // Check if connection is established
      if (!isConnectionEstablished) {
        addMessage(
          "Unable to send message. Connection to server lost.",
          "system",
          new Date()
        );
        return;
      }

      isWaitingForResponse = true;
      chatInput.disabled = true;
      chatSend.disabled = true;

      addMessage(content, "user", new Date());

      socket.emit("send_message", {
        conversationId,
        content,
        sender: "user",
        visitorId,
      });

      chatInput.value = "";
      showTypingIndicator();

      // Add a timeout to remove typing indicator and re-enable input in case of server failure
      setTimeout(() => {
        if (isWaitingForResponse) {
          hideTypingIndicator();
          isWaitingForResponse = false;
          chatInput.disabled = false;
          chatSend.disabled = false;
          addMessage(
            "The server is taking too long to respond. Please try again.",
            "system",
            new Date()
          );
        }
      }, 30000);
    }
  }

  // Event Listeners
  chatButton.addEventListener("click", function () {
    chatWindow.classList.toggle("active");
    if (chatWindow.classList.contains("active")) {
      chatInput.focus();
    }
  });

  chatClose.addEventListener("click", function () {
    chatWindow.classList.remove("active");
  });

  chatSend.addEventListener("click", sendMessage);

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Check for connection problems
  setInterval(function () {
    if (socket && !socket.connected && isConnectionEstablished) {
      isConnectionEstablished = false;
      addMessage(
        "Connection lost. Attempting to reconnect...",
        "system",
        new Date()
      );
    }
  }, 5000);
})();
