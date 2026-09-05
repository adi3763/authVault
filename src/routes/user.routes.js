const express = require("express");
const Router = express.Router();
const { verifyJwt, authorize } = require("../middlewares/auth.middleware");
const { getUsers } = require("../controllers/user.controller");

Router.get("/users", verifyJwt, authorize("admin", "manager"), getUsers);

module.exports = Router;
