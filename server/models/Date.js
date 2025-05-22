const mongoose = require("mongoose")

const DateSchema = new mongoose.Schema({
  plain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plain",
    required: true,
  },
  value: {
    type: Date,
    required: true,
  },
  type: {
    type: Number,
    default: 2,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Date", DateSchema);