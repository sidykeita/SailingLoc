const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://sailingadmin:sailingpass@mongo:27017/sailingloc?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected: mongo');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
