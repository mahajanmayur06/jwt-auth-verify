const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [
        {
            type: String,
            enum: ["read", "write", "delete", "update"], // Define as per your app needs
        },
    ],
});

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
