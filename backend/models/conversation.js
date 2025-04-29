const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  visitorId: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  metadata: {
    userAgent: String,
    referrer: String,
    pageUrl: String,
    ipAddress: String
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);