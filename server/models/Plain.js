const mongoose = require("mongoose");

const PlainSchema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: Boolean,
    default: 0,
    required: true
  },
  after: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plain'
  },
  prev: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plain"
  },
  content: {
    type: String,
    // required: true,
  },
  cells: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plain", PlainSchema);
