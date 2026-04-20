const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  topicId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Subscription", subSchema);