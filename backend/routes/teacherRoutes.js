const express = require('express');
const {
    registerTeacher,

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

// User Registration
router.post('/register', registerTeacher);

router.post('/courses/register', isAuthenticated, registerCourse);

router.put('/:courseId', isAuthenticated, validateCourse, updateCourse);

router.post('/:courseId/chat', isAuthenticated, validateCourse, newChatStudent);

router.post('/:chatId', isAuthenticated, validateChat, sendMessage);

router.get('/:chatId', isAuthenticated, validateChat, existingChat);


module.exports = router;