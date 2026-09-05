const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config/env");
const ApiError = require("../utils/ApiError");
const User = require("../models/User.model");

const verifyJwt = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Access token required");
        }

        const token = authHeader.replace("Bearer ", "");

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new ApiError(401, "Access token expired");
            }
            throw new ApiError(401, "Invalid access token");
        }

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new ApiError(401, "User no longer exists");
        }

        req.user = user;
        next();
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 401;
        const message = err instanceof ApiError ? err.message : "Invalid token";
        return res.status(statusCode).json({ error: message });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            console.warn('AUTHZ_DENIED', {
                userId: req.user?._id,
                role: req.user?.role,
                requiredRoles: allowedRoles,
                route: req.originalUrl,
                timestamp: new Date().toISOString(),
            });
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};
module.exports = { verifyJwt, authorize };