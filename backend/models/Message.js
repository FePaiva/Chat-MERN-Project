const mongoose = require('mongoose'); 

const MessageSchema = new mongoose.Schema({
  constent: String,
  from: Object, 
  socketid: String,
  time: String,
  date: String,
  to: String,
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;