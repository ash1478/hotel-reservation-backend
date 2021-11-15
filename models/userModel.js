const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: true
        },
        token: {
            type: String,
            unique: true
        }
    }
);

let User = mongoose.model("user", userSchema);

module.exports = User;