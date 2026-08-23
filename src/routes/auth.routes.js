const express = require("express");
const Router = express.Router();
const { verifyJwt } = require("../middlewares/auth.middleware");
const { register, login, getMe } = require("../controllers/auth.controller");

Router.post("/register", register);
Router.post("/login", login);
Router.get("/me", verifyJwt, getMe);

module.exports = Router