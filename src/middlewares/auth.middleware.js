const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config/env");
const ApiError = require("../utils/ApiError");

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            throw new Apierror(401, "Token is required");
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken.userId)
        if (!user) {
            throw new ApiError(401, "User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid token");
    }
}

module.exports = { verifyJwt };