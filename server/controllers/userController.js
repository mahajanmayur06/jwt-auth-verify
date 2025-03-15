const bcrypt = require('bcrypt');
const User = require('../models/User');

// ✅ Register User
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Get User By ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Update User (Admin & Editor)
const updateUser = async (req, res) => {
    const { username, role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (username) user.username = username;
        if (role) user.role = role;

        await user.save();
        res.status(200).json({ success: true, message: "User updated successfully", user });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Delete User (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { registerUser, getAllUsers, getUserById, updateUser, deleteUser };
