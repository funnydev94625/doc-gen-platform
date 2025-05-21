const mongoose = require("mongoose")

const SelectSchema = new mongoose.Schema({
  plain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plain",
    required: true,
  },
  value: {
    type: Array,
    required: true,
  },
  type: {
    type: Number,
    default: 1,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Select", SelectSchema);