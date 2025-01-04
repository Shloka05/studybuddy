require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL;

mongoose.connect(`${mongoURL}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB!');
  
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

  app.use(express.json());

  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  })