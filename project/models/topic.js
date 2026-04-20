const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: String,
  accessCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Topic", topicSchema);