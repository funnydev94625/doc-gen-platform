const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  docx: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', TemplateSchema); 