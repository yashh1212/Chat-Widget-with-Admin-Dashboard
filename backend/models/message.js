const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    ref: 'Conversation'
  },
  content: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true,
    enum: ['user', 'ai', 'system']
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);