const express = require('express');
const {
    registerTeacher,
    getTeacherForms,
} = require('../controllers/teacherController');
const {
    registerCourse,
    updateCourse, 
    deleteCourse
} = require('../controllers/courseController');
const { 
    isAuthenticated,
} = require('../controllers/authController');

const router = express.Router();

// Teacher Registration Form
router.post('/register', registerTeacher);

// Get all teacher forms
router.get('/forms',isAuthenticated, getTeacherForms);

// Course Addition
router.post('/courses/register', registerCourse);

module.exports = router;