const express = require('express');
const {
    registerTeacher,
    getTeacherForms,
} = require('../controllers/teacherController');
const {
    registerCourse,
    validateCourse,
    updateCourse, 
    getCourses
} = require('../controllers/courseController');

const {sendMessage} = require('../controllers/messageController');
const { validateChat, newChatStudent, existingChat} = require('../controllers/chatController');

const { isAuthenticated, isAdmin } = require('../controllers/authController');


const router = express.Router();

// Teacher Registration Form
router.post('/register', registerTeacher);

// Get all teacher forms
router.get('/forms',isAuthenticated, getTeacherForms);




router.post('/courses/register', isAuthenticated, registerCourse);

router.get('/:teachId/courses', isAuthenticated, getCourses);

router.put('/:courseId', isAuthenticated, validateCourse, updateCourse);



router.post('/:courseId/chat', isAuthenticated, validateCourse, newChatStudent);

router.post('/:chatId', isAuthenticated, validateChat, sendMessage);

router.get('/:chatId', isAuthenticated, validateChat, existingChat);

module.exports = router;