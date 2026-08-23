require('dotenv').config();

const express = require('express');
const dbConnect = require('./src/db/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


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