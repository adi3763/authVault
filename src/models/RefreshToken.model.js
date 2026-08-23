const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        index: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: boolean,
        default: false
    }
})

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);