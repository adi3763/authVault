const express = require("express");
const Router = express.Router();
const { verifyJwt } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/auth.middleware");
const { createTask, updateTask } = require("../controllers/task.controller");

Router.post("/tasks", verifyJwt, authorize('admin', 'manager', 'employee'), createTask);
Router.patch("/tasks/:taskId", verifyJwt, authorize('admin', 'manager', 'employee'), updateTask);

module.exports = Router;
