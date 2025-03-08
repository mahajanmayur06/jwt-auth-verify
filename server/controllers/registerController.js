const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/User')

const registerController = async (req, res) => {
    const { username, password } = req.body

    console.log(username);
    try {
        email = username + "@gmail.com"
        const user = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, 10)
        })

        console.log(user.username,  user.password);

        res.status(201).json({
            success: true,
            message: "User created successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = registerController;