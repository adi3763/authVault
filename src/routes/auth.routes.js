const express = require("express");
const Router = express.Router();
const { verifyJwt } = require("../middlewares/auth.middleware");
const { register, login, getMe, refreshAccessToken } = require("../controllers/auth.controller");

Router.post("/register", register);
Router.post("/login", login);
Router.post("/refresh-token", refreshAccessToken);
Router.get("/me", verifyJwt, getMe);

module.exports = Router