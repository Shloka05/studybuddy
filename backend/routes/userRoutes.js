const express = require('express');
const {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { 
    isAuthenticated,
} = require('../controllers/authController');

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get user by ID (Authenticated) - to retrieve personal info
router.get('/:id', isAuthenticated, getUserById);

// Update user (Authenticated)
router.put('/:id', isAuthenticated, updateUser);

// Delete user
router.delete('/:id', isAuthenticated, deleteUser);

module.exports = router;
