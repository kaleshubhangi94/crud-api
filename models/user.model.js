// models/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: mongoose.Types.ObjectId,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    hobbies: {
        type: [String],
        default: [],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
