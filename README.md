# Chat Widget & Admin Dashboard

A complete solution for adding a live chat widget to any website with AI-powered responses and an admin dashboard to manage conversations.

## Project Structure

The project consists of three main components:

1. **Backend Server** - Node.js/Express server that handles WebSocket connections, database operations, and AI integration
2. **Widget** - Embeddable JavaScript chat widget that can be added to any website
3. **Admin Dashboard** - Next.js admin dashboard for analyzing and managing chat conversations

## Features

- Embeddable chat widget with minimized/expanded states
- Real-time messaging using Socket.IO
- AI-powered responses via Google Gemini API
- Chat history persistence across page refreshes
- Conversation analytics dashboard
- Search and filter capabilities for conversation history
- Detailed conversation thread viewer with timestamps
- MongoDB integration for data storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (using provided connection string)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development servers:

```bash
# Start both frontend and backend servers
npm run dev:all

# Or start individually
npm run dev        # Frontend
npm run backend    # Backend
```

## Usage

### Embedding the Chat Widget

To add the chat widget to any website, include the following script tag before the closing body tag:

```html
    <script src="https://demo-backend-1-jnh0.onrender.com/widget/chat-widget.js"></script>
```

### Accessing the Admin Dashboard

The admin dashboard is available at:

```
https://chatadmindashboard.vercel.app/
```

### Backend API

- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:id` - Get a specific conversation with messages
- `GET /api/stats` - Get analytics data
- `GET /api/search?query=text` - Search conversations

### WebSocket Events

- `join_conversation` - Join a conversation room
- `send_message` - Send a new message
- `receive_message` - Receive a new message
- `conversation_joined` - Confirmation of joining a conversation
- `previous_messages` - Receive previous messages in a conversation

## Configuration

Key configuration files:

- `backend/index.js` - Main server configuration
- `public/widget/chat-widget.js` - Embeddable widget code
- `app/dashboard/*` - Admin dashboard pages

