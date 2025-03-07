const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expires: {
        type : Number,
        default: 7 * 24 * 60 * 60, // Token expires in 7 days
    }
});

const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
