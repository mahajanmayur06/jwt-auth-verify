const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ["admin", "editor", "viewer"], 
        required: true 
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
