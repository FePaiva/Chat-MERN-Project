const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://fepaiva:${process.env.DB_PW}@cluster0.jqosh.mongodb.net/?retryWrites=true&w=majority`, ()=> {
  console.log("connected to database in mongodb")
})