const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Token = require('../models/Token');

const authController = async (req, res) => {
    const { username, password } = req.query;

    try {
        const user = await User.findOne({ username })
            .select('+password')
            .exec();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate Tokens
        const accessToken = jwt.sign(
            { username: user.username, role: user.role },
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: "45s" }
        );

        const refreshToken = jwt.sign(
            { username: user.username },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "7d" }
        );

        // Store refresh token in DB (optional)
        await Token.findOneAndUpdate(
            { userId: user._id },
            { token: refreshToken, expires: 7 * 24 * 60 * 60 },
            { upsert: true, new: true }
        );

        // Set refresh token as HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            accessToken: accessToken
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = authController;
