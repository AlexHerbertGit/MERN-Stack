//User Model
// Defines how User records are stored in MongoDB via Mongoose.
// Stores a password *hash* and never the raw password.
// 'role' is constrainted to 'beneficiary' or 'member'
// 'tokenBalance' defaults to 0 here, we set the inital token balance of 10 for benficiaries at user registration.

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['beneficiary', 'member'], required: true },
  address: { type: String },
  tokenBalance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);