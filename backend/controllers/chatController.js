
const Chat = require('../models/chatModel'); // Ensure Chat model is imported
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const validateChat = async (req, res, next) => {
    try {
      const { chatId } = req.params;
  
      // Check if the course exists in the database
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Attach the course to the request object if needed
      req.chat = chat;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const newChatStudent = async (req, res) => {
    // const {latestMessage } = req.body;
    const { chatId } = req.params;
    // Validate required fields

    try {
        // Create a new chat instance
        const chat = await Chat.findById(chatId);
        chat = new Chat({
            users: [req.user._id],
        });

        // Save the chat to the database
        await chat.save();

        res.status(201).json({ message: 'Chat entered successfully', chat });
        
    } catch (err) {
        res.status(400).json({ message: 'Error creating chat', error: err.message });
    }
};

const existingChat = async (req, res) => {
    const { chatId } = req.params;
    try {
        const chat = await Chat.findById(chatId);
        const messages = await Message.find().populate('chatId');
        const latest = await Message.findById(chat.latestMessage);
        const sender = await User.findById(latest.sender);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
            }
            res.status(200).json({ message: 'Chat found', chat, messages, latest, sender });

            } catch (err) {
                res.status(500).json({ message: 'Error finding chat', error: err.message });
                }
}


module.exports = { newChatStudent , validateChat, existingChat};
