const mongoose = require("mongoose");

const BlankSchema = mongoose.Schema({
  template_id: {
    type: mongoose.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
    required: true,
  },
  question: {
    type: String,
    // default: "",
  },
  ans_res: {
    type: Object,
  },
  section_id: {
    type: mongoose.Types.ObjectId,
    ref: "Section",
  },
  blankable: {
    type: Boolean,
  },
  output: {
    type: String,
    default: "$$$",
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blank", BlankSchema);
