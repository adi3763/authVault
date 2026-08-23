const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../services/token.service");

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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    return { user: userObj, accessToken, refreshToken };
};

module.exports = { registerUser, loginUser };