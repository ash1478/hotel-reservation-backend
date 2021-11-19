const express = require('express');
const router = express.Router();
const app = express();
const authRoutes = require('./authRoutes');
const hotelRoutes = require('./hotelRoutes');
const bookingRoutes = require('./bookingRoutes');

app.get("/", (req, res) => {
    res.send("Default Route!");
});

//Auth Routes
app.use("/auth", authRoutes);

//Hotel Routes
app.use("/hotels", hotelRoutes);

//Booking Routes
app.use("/booking",bookingRoutes);

module.exports = app;


