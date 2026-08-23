const mongoose = require('mongoose');

const dbConnect = async () => {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB Connected: ${connectionInstance.connection.host}`);
};

module.exports = dbConnect;