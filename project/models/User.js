const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
});

module.exports = mongoose.model('User', userSchema);
