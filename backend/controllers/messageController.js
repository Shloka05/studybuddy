const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

const sendMessage = async (req, res) => {
    const {content} = req.body;
    const { chatId } = req.params
    try{
        if(!content){
            return res.status(400).json({error: 'Missing message'});
    
        }
        const message = new Message({
            sender: req.user._id,
            content,
            chatId: req.chat._id
            });
            await message.save();
            console.log(message);
            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: message._id,
            })
            res.json(message);
            } 
            catch (error) {
                console.error(error);
                res.status(500).json({error: 'Failed to send message'});
                }

    
}

module.exports = {sendMessage}