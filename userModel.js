// this file contains declaration of data fields of user data in the database

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registerd_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("user", userSchema);