const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the chat schema
const chatSchema = new Schema({
  chatroomid: String,
  chats: [{
    username: String,
    userid: String,
    chattext: String,
    timestamp: Date,
  }]
});

// Create the chat model
module.exports = mongoose.model("Chat", chatSchema);
