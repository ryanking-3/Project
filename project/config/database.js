const mongoose = require('mongoose');

let instance = null;

async function connect() {
  if (!instance) {
    instance = await mongoose.connect('mongodb://127.0.0.1:27017/messageboard');
  }
  return instance;
}

connect();

module.exports = mongoose;