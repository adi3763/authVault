const authService = require("../services/auth.service");
const User = require("../models/User.model");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    const user = await authService.registerUser(name, email, password);

    return res.status(201).json({
        message: "User registered successfully",
        user
    })
}

module.exports = { register }