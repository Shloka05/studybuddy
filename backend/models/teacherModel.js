const mongoose = require('mongoose');

const teachSchema = new mongoose.Schema({
  teachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sex: String,
    age: Number,
    subject: String,
    pastExp: String,
    qualification: {
        data: Buffer,
        contentType: String,
        originalName: String,
    },
    image: {
        data: Buffer,
        contentType: String,
        originalName: String,
    },
    formStatus: Number,
    remark: String,
});

module.exports = mongoose.model('Teacher', teachSchema);