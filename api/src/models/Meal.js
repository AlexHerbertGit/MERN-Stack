// Meal Model

const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dietary: { type: [String], default: [] },
  qtyAvailable: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Meal', MealSchema);
