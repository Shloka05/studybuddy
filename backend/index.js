require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');  // Importing CORS
const path = require('path');

const app = express();
const server = http.createServer(app); // Create an HTTP server with Express

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;

// Middleware for CORS
app.use(cors({
  origin: "http://localhost:5174", // Frontend URL without trailing slash
  methods: ["GET", "POST"], // Allow only GET and POST requests
}));

// Socket.IO configuration
const io = new Server(server, {
  pingTimeout: 60000, // Handles inactive clients
  cors: {
    origin: "http://localhost:5174", // Allow socket.io connections from this origin
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose.connect(mongoURL, {

})
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

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Example: Handle 'message' event from the client
  socket.on('message', async (data) => {
    console.log('Message received:', data);

    try {
      // Save message to MongoDB if needed
      const { sender , content, chatId } = data;

      const Message = require('./models/messageModel'); // Replace with actual path to your Message model
      const newMessage = new Message({
        sender: sender,
        content,
        chatId: chatId,
      });

      await newMessage.save();

      // Emit the saved message back to all connected clients
      // io.emit('message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
