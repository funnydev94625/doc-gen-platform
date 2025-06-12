const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAnswerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserAnswer", userAnswerSchema);
