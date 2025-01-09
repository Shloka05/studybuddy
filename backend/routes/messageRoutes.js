const express = require('express');
const { isAuthenticated, isAdmin } = require('../controllers/authController');
const router = express.Router();

const {sendMessage} = require('../controllers/messageController');

router.post('/message', sendMessage)
