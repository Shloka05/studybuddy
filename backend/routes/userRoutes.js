const express = require('express');
const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole,
    getTeacher
} = require('../controllers/userController');

const { isAuthenticated, isAdmin } = require('../controllers/authController');

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get all users (Admin only)
router.get('/', isAuthenticated, isAdmin, getAllUsers);

//Get all teachers
router.get('/teachers', isAuthenticated, isAdmin, getTeacher);

// Get user by ID (Authenticated)
router.get('/:id', isAuthenticated, getUserById);

// Get users by role (Admin only)
router.get('/role/:role', isAuthenticated, isAdmin, getUsersByRole);

// Update user (Authenticated)
router.put('/:id', isAuthenticated, updateUser);

// Delete user (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

module.exports = router;
