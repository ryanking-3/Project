const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  content:   { type: String, required: true, trim: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic:     { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);