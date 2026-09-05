const mongoose = require('mongoose');

const dbConnect = async () => {
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB Connected: ${connectionInstance.connection.host}`);
};

module.exports = dbConnect;