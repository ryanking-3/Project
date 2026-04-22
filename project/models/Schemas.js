const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Added for your form
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
});

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  accessCount: { type: Number, default: 0 }
});

const MessageSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Topic: mongoose.model('Topic', TopicSchema),
  Message: mongoose.model('Message', MessageSchema)
};