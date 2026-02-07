const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  projectId: Number,
  sender: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
