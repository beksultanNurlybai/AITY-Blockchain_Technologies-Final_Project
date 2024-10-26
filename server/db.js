const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://beks:ajUn5GfZzIRNel4x@cluster0.mqirzqt.mongodb.net/blockchain?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
