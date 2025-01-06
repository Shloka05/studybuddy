const express = require('express');
const {
    registerCourse,
    updateCourse, 
    deleteCourse

} = require('../controllers/courseController');



const router = express.Router();

// User Registration
router.post('/register', registerCourse);

//Update course
router.put('/:id', updateCourse);

//Delete course
router.delete('/:id', deleteCourse);

module.exports = router;