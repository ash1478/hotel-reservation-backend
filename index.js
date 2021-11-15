const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" })
const port = process.env.PORT || "8000";
const routeManager = require('./routes/routeManager');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongo Connected')
    })
    .catch(err => console.log(err))

app.use(express.json())
app.use("/", routeManager);




app.listen(port, () => {
    console.log("Server is active at port : " + process.env.PORT);
})