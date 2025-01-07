const User = require('../models/userModel');
const Teacher = require('../models/teacherModel');


// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        // const users = await Teacher.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Get users by role (Admin only)
const getUsersByRole = async (req, res) => {
    try {
        const role = req.params.role;
        const users = await User.find({ role });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users by role', error: err.message });
    }
};

// Get Teacher Forms (Admin only)
const getTeachers = async (req,res) => {
    try{
        const teacher = await Teacher.find().populate('teachId'); // Populate teachId
        
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
    }catch(err){
        res.status(500).json({message: 'Error fetching teacher', error: err.message});
    }
};

// Get teacher form by ID (retrieve all info including images and PDFs)
const getTeacherById = async (req, res) => {
    const { teacherId } = req.params;
    
    try {
        const teacher = await Teacher.findById(teacherId).populate('teachId');
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const teacherForm = {
            teachId: teacher.teachId,
            sex: teacher.sex,
            age: teacher.age,
            subject: teacher.subject,
            pastExp: teacher.pastExp,
            qualification: teacher.qualification,
            image: teacher.image,
            formStatus: teacher.formStatus,
            remark: teacher.remark,
        };
        
        res.status(200).json(teacherForm);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving teacher data', error: err.message });
    }
};

// Update Teacher Status
const updateTeacherStatus = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { formStatus, remark } = req.body;

        // Validate the formStatus input
        if (typeof formStatus !== 'number' || (formStatus < 1 && formStatus > 6)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find and update the teacher
        const teacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { formStatus, remark },
            { new: true, runValidators: true }
        );

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        res.status(200).json({
            message: 'Teacher status updated successfully',
            teacher,
        });
    } catch (error) {
        console.error('Error updating teacher status:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getAllUsers,
    getUsersByRole,
    getTeachers,
    getTeacherById,
    updateTeacherStatus,
};