const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken, rotateRefreshToken, revokeRefreshToken, revokeAllUserTokens, generatePasswordResetToken, verifyPasswordResetToken } = require("../services/token.service");

const registerUser = async ({ name, email, password }) => {
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
        throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, hashedPassword });

    const userObj = user.toObject();
    delete userObj.hashedPassword;

    return userObj;
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+hashedPassword');

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const userObj = user.toObject();
    delete userObj.hashedPassword;

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = await generateRefreshToken(user._id, user.role);

    return { user: userObj, accessToken, refreshToken };
};

const refreshAccessToken = async ({ refreshToken }) => {
    return await rotateRefreshToken(refreshToken);
};

const logoutUser = async ({ refreshToken }) => {
    await revokeRefreshToken(refreshToken);
};

const forgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });

    if (!user) {
        return;
    }

    const rawToken = await generatePasswordResetToken(user._id);

    console.log(`Password reset link: http://localhost:3000/reset-password?token=${rawToken}`);
}

const resetPassword = async ({ token, newPassword }) => {
    const userId = await verifyPasswordResetToken(token);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, { hashedPassword });

    await revokeAllUserTokens(userId);
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser, forgotPassword, resetPassword };