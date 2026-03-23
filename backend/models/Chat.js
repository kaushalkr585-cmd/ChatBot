const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, default: "New Chat" },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    hasImage: { type: Boolean, default: false },
    imageBase64: { type: String, default: "" }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
