const express = require('express');
const userRouter = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const authController = require('../controllers/authController');
const registerController = require('../controllers/registerController')

const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRoles');  // Role-based access control middleware

// Public Routes
userRouter.post('/register', registerController);
userRouter.post('/auth', verifyJWT, authController);

// Protected Routes (Require Authentication)
userRouter.get('/users', verifyJWT, verifyRole(['admin']), getAllUsers);
userRouter.get('/users/:id', verifyJWT, getUserById);
userRouter.put('/users/:id', verifyJWT, verifyRole(['admin', 'editor']), updateUser);
userRouter.delete('/users/:id', verifyJWT, verifyRole(['admin']), deleteUser);

module.exports = userRouter;
