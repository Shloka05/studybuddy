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




module.exports = {
    registerTeacher,

};
