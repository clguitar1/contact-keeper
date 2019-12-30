const mongoose = require('mongoose');
const config = require('config');
// const db = config.get('mongoURI');
require('dotenv').config();
const db = process.env.ATLAS_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    console.log('MongoDB connected...');
  } catch (error) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
