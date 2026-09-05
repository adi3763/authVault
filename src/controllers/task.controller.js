const taskService = require("../services/taskservice");
const ApiError = require("../utils/ApiError");

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;

        const task = await taskService.createTask({
            title,
            description,
            assignedTo,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;

        const task = await taskService.updateTask({
            taskId,
            title,
            description,
            status,
            requestingUserId: req.user._id,
            requestingUserRole: req.user.role,
        });

        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal server error";
        return res.status(statusCode).json({ error: message });
    }
}

module.exports = { createTask };
