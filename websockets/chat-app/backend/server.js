const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

let users = [];
const ROOM_NAME = 'general';

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join', (name) => {
    const user = { id: socket.id, name, isTyping: false };
    users.push(user);

    socket.join(ROOM_NAME);
    
    // Notify everyone about new user
    io.to(ROOM_NAME).emit('userJoined', {
      message: `${name} joined the chat`,
      users: users
    });

    console.log(`${name} joined. Total users: ${users.length}`);
  });

  socket.on('sendMessage', (data) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.to(ROOM_NAME).emit('receiveMessage', {
        id: socket.id,
        name: user.name,
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });

  socket.on('typing', (isTyping) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      user.isTyping = isTyping;
      io.to(ROOM_NAME).emit('userTyping', {
        name: user.name,
        isTyping: isTyping
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      users = users.filter(u => u.id !== socket.id);
      io.to(ROOM_NAME).emit('userLeft', {
        message: `${user.name} left the chat`,
        users: users
      });
      console.log(`${user.name} disconnected. Total users: ${users.length}`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
