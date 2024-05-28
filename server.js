const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('message', (message) => {
    // Emit the message to all clients except the sender
    socket.broadcast.emit('message', { text: message.text, self: message.self, id: socket.id });
  });

  socket.on('typing', (typingMessage) => {
    socket.broadcast.emit('typing', typingMessage);
    console.log('typing');
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
