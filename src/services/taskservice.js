const Task = require("../models/task.model");
const ApiError = require("../utils/ApiError");
const User = require("../models/User.model");

const createTask = async ({ title, description, assignedTo, createdBy }) => {
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!createdBy) {
        throw new ApiError(400, "Created by is required");
    }

    const creator = await User.findById(createdBy);

    if (!creator) {
        throw new ApiError(400, "Invalid user");
    }

    if (creator.role === "admin" || creator.role === "manager") {
        if (!assignedTo) {
            throw new ApiError(400, "assignedTo is required");
        }

        const assignee = await User.findById(assignedTo);
        if (!assignee) {
            throw new ApiError(400, "Invalid assignee");
        }
    } else if (creator.role === "employee") {
        if (assignedTo && assignedTo.toString() !== createdBy.toString()) {
            throw new ApiError(403, "Employees can only create tasks for themselves");
        }
        assignedTo = createdBy;
    } else {
        throw new ApiError(403, "Forbidden: insufficient permissions");
    }

    const task = await Task.create({ title, description, assignedTo, createdBy });
    return task;
}

const updateTask = async ({ taskId, requestingUserId, updates, requestingUserRole }) => {

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // authorization
    if (requestingUserRole == "admin" || requestingUserRole == "manager") {
        const updateTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        return updateTask;
    } else if (requestingUserRole == "employee") {
        if (task.assignedTo.toString() !== requestingUserId.toString()) {
            throw new ApiError(403, "Forbidden: insufficient permissions");
        }
        const updateTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        return updateTask;
    } else {
        throw new ApiError(403, "Forbidden: insufficient permissions");
    }

}

module.exports = { createTask, updateTask };