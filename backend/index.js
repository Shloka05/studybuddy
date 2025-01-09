require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');

const app = express();
const server = http.createServer(app); 

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;

app.use(cors({
  origin: "http://localhost:5174", 
  methods: ["GET", "POST"], 
}));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

mongoose.connect(mongoURL)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teachers', teacherRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle chat room joining
  socket.on('joinChat', (chatId) => {
    // Leave all other rooms before joining the new one
    Array.from(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    // Join the specified chat room
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Handle incoming messages
  socket.on('message', async (data) => {
    console.log('Message received:', data);

    try {
      const { sender, content, chatId } = data;

      const Message = require('./models/messageModel'); 
      const Chat = require('./models/chatModel');

      const newMessage = new Message({
        sender: sender,
        content,
        chatId: chatId,
      });

      // Save the message in the database
      await newMessage.save();
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: newMessage._id,
      });

      // Emit the saved message only to users in the relevant chat room
      io.to(chatId).emit('message', {
        sender: newMessage.sender,
        content: newMessage.content,
        chatId: newMessage.chatId,
      });

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
