const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')

const rooms = ['general', 'tech', 'finance', 'crypto'];
const cors = require('cors');

// to receive data from the frontend
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// link to user routes
app.use('/users',userRoutes)
require('./connection')


const server = require('http').createServer(app);
const PORT = 5001;

// for sockets - to send data client x server
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST']
  }
});

server.listen(PORT, () => {
  console.log('listening on port', PORT)
})

