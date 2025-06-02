const mongoose = require('mongoose')

const ElementSchema = new mongoose.Schema({
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  placeholder: {
    type:String,
    // required: true
  },
  answer_result: {
    type: Object
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    // required: true
  },
  isDel: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Element", ElementSchema);