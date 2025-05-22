const mongoose = require("mongoose");

const InputSchema = new mongoose.Schema({
  plain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plain",
    required: true,
  },
  value: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
  },
  type: {
    type: Number,
    default: 0, // 0 -> input, 1 -> date
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Input", InputSchema);
