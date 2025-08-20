//Order Model

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'cancelled'], default: 'pending' },
  costTokens: { type: Number, default: 1, min: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);