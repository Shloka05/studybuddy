require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');  // Importing CORS
const path = require('path');

const app = express();
const server = http.createServer(app);  // Create an HTTP server with Express
// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:5173/",
//     methods: ['GET', 'POST'],
//   },
// });         // Set up Socket.IO with the server
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;

app.use(cors({
  origin: "http://localhost:5173", // This should be the frontend URL
  methods: ["GET", "POST"], // Allow only GET and POST requests
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow socket.io connections from this origin
    methods: ["GET", "POST"],
  },
});
mongoose.connect(`${mongoURL}`)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teachers', teacherRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // You can handle socket events here
  // For example, a message event
  socket.on('message', (data) => {
    console.log('Message received: ', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server with both HTTP and WebSocket
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
