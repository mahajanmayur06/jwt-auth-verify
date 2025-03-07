const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ipAddress: String,
    deviceInfo: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Session expires in 30 days
    },
});

const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;
