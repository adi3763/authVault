const express = require("express");
const Router = express.Router();
const { verifyJwt } = require("../middlewares/auth.middleware");
const { register, login, getMe, refreshAccessToken, logout, forgotPassword } = require("../controllers/auth.controller");

Router.post("/register", register);
Router.post("/login", login);
Router.post("/refresh-token", refreshAccessToken);
Router.post("/logout", logout);
Router.get("/me", verifyJwt, getMe);
Router.post("/forgot-password", forgotPassword);

module.exports = Router