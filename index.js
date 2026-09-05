require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConnect = require('./src/db/index');
const authRouter = require('./src/routes/auth.routes');
const taskRouter = require('./src/routes/task.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1", authRouter);
app.use("/api/v1", taskRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to DB:', err.message);
        process.exit(1);
    });