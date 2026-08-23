const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ms = require("ms");
const RefreshToken = require("../models/RefreshToken.model");

const {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
} = require("../config/env");

const generateAccessToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = async (userId) => {
    const randomToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(randomToken).digest('hex');

    await RefreshToken.create({
        token: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRY)),
    });

    return randomToken;
};

module.exports = { generateAccessToken, generateRefreshToken };