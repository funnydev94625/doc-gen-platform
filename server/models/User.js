const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  isVerified: { type: Boolean, default: false }, // <-- NEW
  verificationToken: { type: String },           // <-- NEW
  createdAt: { type: Date, default: Date.now },
  organization: {type: String},
  status: { type: Number, default: 0 }, // 0: pending, 1: active, 2: suspended
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);