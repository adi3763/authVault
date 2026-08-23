const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken.model");
const crypto = require("crypto");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require("../config/env");

const generateAccessToken = (userId) => {
    const payload = {
        _id: userId,
    }

    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });

    return token;
}

const generateRefreshToken = async (userId) => {
    const randomToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(randomToken).digest('hex');

    const tokenCreated = await RefreshToken.create({
        token: hashedToken,
        userId,
        expiresAt: REFRESH_TOKEN_EXPIRY,
    });

    return randomToken;
};


module.exports = { generateAccessToken, generateRefreshToken };