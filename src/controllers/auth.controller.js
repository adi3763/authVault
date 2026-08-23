const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");
const User = require("../models/User.model");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await authService.registerUser({ name, email, password });

        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });

        return res.status(200).json({
            message: "User logged in successfully",
            user,
            accessToken,
            refreshToken,
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            message: "User data fetched successfully",
            user: req.user
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new ApiError(400, "Refresh token is required");
        }

        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken({ refreshToken });

        return res.status(200).json({
            message: "Tokens refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new ApiError(400, "Refresh token is required");
        }

        await authService.logoutUser({ refreshToken });

        return res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

module.exports = { register, login, getMe, refreshAccessToken, logout };