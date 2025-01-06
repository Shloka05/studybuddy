const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Teacher = require('../models/teacherModel');


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Add your validation logic here (e.g., file types)
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).fields([
    { name: 'qualification', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

// Register teacher and save files as blobs
const registerTeacher = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }

        // Destructure and validate body fields
        const { sex, age, subject, pastExp } = req.body;

        if (!sex || !age || !subject || !pastExp) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        console.log(req.files.qualification);
        // Check if both files are uploaded
        if (!req.files || !req.files.qualification || !req.files.image) {
            return res.status(400).json({ message: 'Both qualification and image files are required' });
        }

        try {
            // Create a new teacher document with blob data
            const teacher = new Teacher({
                sex,
                age,
                subject,
                pastExp,
                qualification: {
                    data: req.files.qualification[0].buffer,
                    contentType: req.files.qualification[0].mimetype,
                    originalName: req.files.qualification[0].originalname,
                },
                image: {
                    data: req.files.image[0].buffer,
                    contentType: req.files.image[0].mimetype,
                    originalName: req.files.image[0].originalname,
                },
            });

            // Save the teacher document
            await teacher.save();
            res.status(201).json({ message: 'Teacher registered successfully', teacher });
        } catch (err) {
            res.status(400).json({ message: 'Error registering teacher', error: err.message });
        }
    });
};





// User login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ 
            $or: [{ uname: username }, { email: username }]  // This allows either username or email to be used for login
          });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }

};

// Get user by ID
const getUserById = async (req, res) => {
    console.log(mongoose.modelNames()); // Should include 'Task'
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
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

// Update user details
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

module.exports = {
    registerTeacher,
    loginUser,
    getAllUsers,
    getUserById,
    getUsersByRole,
    updateUser,
    deleteUser,
};
