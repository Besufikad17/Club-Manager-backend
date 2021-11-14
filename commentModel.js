// this file contains declaration of data fields of user data in the database

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("comment", userSchema);