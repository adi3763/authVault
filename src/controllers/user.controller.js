const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("name email role");

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

module.exports = { getUsers };
