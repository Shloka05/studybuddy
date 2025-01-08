const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    teacherCourseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    courseName: {type: String, required: true, trim: true},
    category: {type: String, required: true, trim: true},
});

module.exports = mongoose.model('Course', courseSchema);