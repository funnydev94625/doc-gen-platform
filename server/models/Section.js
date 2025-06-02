const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Template",
  },
  isDel: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Section', SectionSchema);