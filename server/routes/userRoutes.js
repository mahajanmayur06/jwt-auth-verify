const express = require('express');
const userRouter = express.Router();

const registerController = require('../controllers/registerController');
const authController = require('../controllers/authController');

userRouter.post('/register', registerController);
userRouter.get('/auth', authController);

module.exports = userRouter;