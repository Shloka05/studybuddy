const mongoose = require('mongoose');

const chatScehma = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    // groupAdmin: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     },

},
{timestamps: true});


module.exports = mongoose.model('Chat', chatScehma);