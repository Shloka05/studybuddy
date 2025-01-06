const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    teacherCourseId: {type: mongoose.Schema.ObjectId, ref: 'Teacher', required: true},
    courseName: {type: String, required: true, trim: true},
    category: {type: String, required: true, trim: true},
});

module.exports = mongoose.model('Course', courseSchema);