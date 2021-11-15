const express = require('express');
const router = express.Router();
const app = express();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
app.get("/", (req, res) => {
    res.send("Default Route!");
});

//Auth Routes
app.use("/auth", authRoutes);

//User Routes



module.exports = app;


