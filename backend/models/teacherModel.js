const mongoose = require('mongoose');

const teachSchema = new mongoose.Schema({
  teachId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sex: {type: String, required: true},
  age: {type: Number, required: true},
  qualification: {type: String, required: true},
  subject: {type: String, required: true},
  pastExp: {type: String, required: true},
  image: {type: String, required: true},
});

module.exports = mongoose.model('Teacher', teachSchema);