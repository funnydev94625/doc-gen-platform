const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserResponseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  answers: {
    type: Object,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserResponse', UserResponseSchema); 