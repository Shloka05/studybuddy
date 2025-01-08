const Course = require('../models/courseModel')
const Chat = require('../models/chatModel')

const registerCourse = async (req, res) => {
    const {courseName, category, } = req.body;

    try {
        
        if(!courseName||!category)
        {
            return res.status(400).json({message: "Please fill in all fields"})
        }
        const course = new Course({teacherCourseId: req.user._id, courseName, category });
        await course.save();

        res.status(201).json({ message: 'Course registered successfully', course });
        const chat = new Chat({
            courseId: course._id,
            users: [req.user._id], // Add the teacher as the initial user in the chat
            latestMessage: null, // Initialize without a message
        });
        await chat.save();

        res.status(201).json({
            message: 'Course registered and chat created successfully',
            course,
            chat
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error registering course or creating chat',
            error: err.message
        })
        }
};


const validateCourse = async (req, res, next) => {
    try {
      const { courseId } = req.params;
  
      // Check if the course exists in the database
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Attach the course to the request object if needed
      req.course = course;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updates = req.body;
        const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });

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
    deleteCourse, 
    validateCourse,
};