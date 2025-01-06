const Course = require('../models/courseModel')

const registerCourse = async (req, res) => {
    const { courseName, category } = req.body;

    try {
        const course = new Course({courseName, category });
        await course.save();
        res.status(201).json({ message: 'Course registered successfully', course });
    } catch (err) {
        res.status(400).json({ message: 'Error registering course', error: err.message });
    }
};
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const course = await Course.findByIdAndUpdate(id, updates, { new: true });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (err) {
        res.status(500).json({ message: 'Error updating course', error: err.message });
    }
};
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ message: 'course not found' });
        }
        res.status(200).json({ message: 'course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting course', error: err.message });
    }
};
module.exports = {registerCourse,
    updateCourse, 
    deleteCourse
};