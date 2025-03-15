const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
require('dotenv').config();

const refreshController = async (req, res) => {
    try {
        // Get refresh token from cookies
        const refreshToken = req.cookies?.jwt;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }

        // Check if refresh token exists in DB
        const storedToken = await Token.findOne({ token: refreshToken });
        if (!storedToken) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired refresh token"
                });
            }

            // Generate new access token
            const newAccessToken = jwt.sign(
                { 
                    userInfo : {
                        username: decoded.username,
                        role : decoded.role
                    } 
                },
                process.env.ACCESS_SECRET_KEY,
                { expiresIn: "45s" }
            );

            res.status(200).json({
                success: true,
                accessToken: newAccessToken
            });
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = refreshController;
