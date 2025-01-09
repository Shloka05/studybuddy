const express = require('express');
const {
    registerTeacher,
    getTeacherForms,
} = require('../controllers/teacherController');
const {
    registerCourse,
    validateCourse,
    updateCourse
} = require('../controllers/courseController');

const {sendMessage} = require('../controllers/messageController');
const { validateChat, newChatStudent, existingChat} = require('../controllers/chatController');

const { isAuthenticated, isAdmin } = require('../controllers/authController');


const router = express.Router();

// Teacher Registration Form
router.post('/register', registerTeacher);

router.post('/courses/register', isAuthenticated, registerCourse);

router.put('/:courseId', isAuthenticated, validateCourse, updateCourse);

router.post('/:courseId/chat', isAuthenticated, validateCourse, newChatStudent);

router.post('/:courseId/:chatId', isAuthenticated, validateCourse, validateChat, sendMessage);

router.get('/:courseId/:chatId', isAuthenticated, validateCourse, validateChat, existingChat);

// Get all teacher forms
router.get('/forms',isAuthenticated, getTeacherForms);

// Course Addition
router.post('/courses/register', registerCourse);

module.exports = router;