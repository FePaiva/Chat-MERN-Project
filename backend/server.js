const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')
const User = require('./models/User')
const Message = require('./models/Message')
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

app.get('/rooms', (req, res) => {
  res.json(rooms)
})

async function getLastMessagesFromRoom(room){
  // using mongodb aggregate to group the msgs per room per date. Documentation https://www.mongodb.com/docs/manual/aggregation/
  let roomMessages = await Message.aggregate([
    // Stage 1: Filter by room
   {
    $match: { to: room }
 },
 // Stage 2: Group by date
 {
    $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" }}
 }
  ])
  return roomMessages;
}

function sortRoomMessagesByDate(messages){
  return messages.sort(function(a, b){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');
    // default is MMDDYYYY. Need to arrange by YYYYMMDD in order to sort.
    date1 = date1[2] + date1[0] + date1[1]
    date2 = date2[2] + date2[0] + date2[1]

    return date1 < date2 ? -1 : 1

  })
}

// socket connection from frontend
io.on('connection', (socket) => {

  // if there is a new user. Socket to listen for new-user
  socket.on('new-user', async () => {
    const members = await User.find();
    // io.emit emits to all users that are in the room, that someone joined the room. Documentation https://socket.io/docs/v4/emitting-events/
    io.emit('new-user', members)
  })


  // to get a room by default, so the user can join an specified room.
  // emitting and listening for events. Join-room is an event in the frontend, which will trigger sending the event room-messages to the client in the frontend.
  socket.on('join-room', async(room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // socket.emit emits the messsages only to the specific user who joined the room.
    socket.emit('room-messages', roomMessages)
  })


})

server.listen(PORT, () => {
  console.log('listening on port', PORT)
})

