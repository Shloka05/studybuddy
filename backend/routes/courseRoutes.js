const express = require('express');
const {
    registerCourse,
    updateCourse, 
    deleteCourse

} = require('../controllers/courseController');

const {isAuthenticated} = require('../controllers/authController');

const router = express.Router();

// User Registration
router.post('/register', isAuthenticated, registerCourse);

//Update course
router.put('/:id', isAuthenticated, updateCourse);

//Delete course
router.delete('/:id', isAuthenticated, deleteCourse);

module.exports = router;