const mongoose = require('mongoose');

const connectDB = async () => { 
    await mongoose.connect("mongodb+srv://kvivek097_db_user:8kGY0g6D9ZmLrwTL@namastenode.llgorli.mongodb.net/devTinder");
};

module.exports = connectDB;

