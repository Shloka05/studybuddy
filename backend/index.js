require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL;
const cors = require('cors');  // Importing CORS
const path = require('path');

app.use(cors());
mongoose.connect(`${mongoURL}`)
.then(() => {
  console.log('Connected to MongoDB!');
  
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(express.json());
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teachers', teacherRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})