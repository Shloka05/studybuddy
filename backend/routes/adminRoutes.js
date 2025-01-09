const express = require('express');
const {
    getAllUsers,
    getUsersByRole,
    getTeachers,
    getTeacherById,
    updateTeacherStatus,
} = require('../controllers/adminController');
const { 
    isAuthenticated, 
    isAdmin 
} = require('../controllers/authController');

const router = express.Router();

// Get all users (Admin only)
router.get('/', isAuthenticated, isAdmin, getAllUsers);

// Get users by role (Admin only)
router.get('/role/:role', isAuthenticated, isAdmin, getUsersByRole);

//Get all teacher forms (Admin only)
router.get('/teachers', isAuthenticated, isAdmin, getTeachers);

// Get teacher form by ID by Admin only
router.get('/:teacherId', isAuthenticated, isAdmin, getTeacherById);

// Update teacher status by Admin only
router.patch('/:teacherId', isAuthenticated, isAdmin, updateTeacherStatus);

module.exports = router;