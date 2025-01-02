const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    try {
        const savedUser = await user.save();
        res.status(201).json({ message: 'User created successfully' });
        } 
        
    catch (error) 
    {
        res.status(400).json({ message: 'Error creating user' });
    }

}

module.exports = { register};