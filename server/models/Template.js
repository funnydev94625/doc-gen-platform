const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    required: true
  },
  questionSchema: {
    type: Object,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', TemplateSchema); 