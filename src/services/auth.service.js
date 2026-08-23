const User = require("../models/User.model");
const RefreshToken = require("../models/RefreshToken.model");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt")

const registerUser = async (name, email, password) => {
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
        ApiError(409, "Email is already exist");
    }

    const hashedPassword = bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        hashedPassword
    })
    console.log(user);
    return user;

}

module.exports = { registerUser };