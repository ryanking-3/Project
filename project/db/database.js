const mongoose = require("mongoose");

let instance = null;

const connectDB = async () => {
  if (instance) return instance;

  try {
    instance = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;