const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommonSchema = new Schema({
  blank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blank",
    required: true,
  },
  answer: {
    type: String,
    required: true,
    default: "",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Common", CommonSchema);
