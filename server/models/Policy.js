const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Policy', PolicySchema);