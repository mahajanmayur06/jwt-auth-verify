const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/User')

const authController = async (req, res) => {
    const { username, password } = req.query

    try {
        const user = await User
            .findOne({ username })
            .select('+password')
            .exec()
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        res.status(200).json({
            success: true,
            message: "User authenticated successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = authController;