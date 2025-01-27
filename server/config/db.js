const mongoose = require('mongoose');

const connectDB = async () => {
  return mongoose 
  .connect(process.env.MONGODB_URI, {
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));
};

module.exports = connectDB;