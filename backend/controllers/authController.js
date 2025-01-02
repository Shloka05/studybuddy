const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');



const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid email or password' });
                }
                const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,
                    { expiresIn: '1h' });
                    res.json({ message: 'Logged in successfully', token });
                    } 
    catch (error) 
        {
            res.status(400).json({ message: 'Error logging in' });
        }
}

module.exports = { login };