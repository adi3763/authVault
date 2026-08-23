const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ms = require("ms");
const RefreshToken = require("../models/RefreshToken.model");
const ApiError = require("../utils/ApiError");

const {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
} = require("../config/env");

// Helper: hash a raw token string using SHA-256
const hashToken = (rawToken) => {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
};

const generateAccessToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = async (userId) => {
    const randomToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(randomToken); // reuse helper

    await RefreshToken.create({
        token: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRY)),
    });

    return randomToken;
};

// Delete ALL refresh tokens for a user (used on theft detection)
const revokeAllUserTokens = async (userId) => {
    await RefreshToken.deleteMany({ userId });
};

// Rotate: validate old token, mark used, issue new pair
const rotateRefreshToken = async (rawToken) => {
    const hashedToken = hashToken(rawToken);

    const storedToken = await RefreshToken.findOne({ token: hashedToken });

    if (!storedToken) {
        throw new ApiError(403, "Invalid refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
        throw new ApiError(403, "Refresh token expired");
    }

    if (storedToken.isUsed) {
        // Token reuse detected → possible theft → revoke entire family
        await revokeAllUserTokens(storedToken.userId);
        throw new ApiError(403, "Refresh token reuse detected. Please login again.");
    }

    // Mark current token as used (one-time use)
    storedToken.isUsed = true;
    await storedToken.save();

    // Issue new token pair
    const accessToken = generateAccessToken(storedToken.userId);
    const refreshToken = await generateRefreshToken(storedToken.userId);

    return { accessToken, refreshToken };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    revokeAllUserTokens,
    rotateRefreshToken,
};