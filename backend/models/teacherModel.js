const mongoose = require('mongoose');

const teachSchema = new mongoose.Schema({
  teachId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sex: {type: String, required: True},
  age: {type: Number, required: True},
  qualification: {type: String, required: True},
  subject: {type: String, required: True},
  pastExp: {type: String, required: True},
  image: {type: String, required: True},
});
module.exports = mongoose.model('Teacher', userSchema);