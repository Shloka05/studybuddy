const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// Register a new user
const registerUser = async (req, res) => {
    const { name, uname, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, uname, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
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
        res.status(200).json({ message: 'Login successful', token, role: user.role });
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
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    getUsersByRole,
    updateUser,
    deleteUser,
};
