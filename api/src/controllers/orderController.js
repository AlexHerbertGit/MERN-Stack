// Order Controller

const mongoose = require('mongoose');
const Meal = require('../models/Meal');
const User = require('../models/User');
const Order = require('../models/Order');

// Beneficiary places an order (spend 1 token, decrement meal qty)
async function placeOrder(req, res) {
  const beneficiaryId = req.user.id;
  const { mealId } = req.body;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const meal = await Meal.findById(mealId).session(session);
      if (!meal) throw new Error('Meal not found');
      if (meal.qtyAvailable <= 0) throw new Error('Meal unavailable');

      const beneficiary = await User.findById(beneficiaryId).session(session);
      if (!beneficiary || beneficiary.role !== 'beneficiary') throw new Error('Invalid beneficiary');
      if (beneficiary.tokenBalance < 1) throw new Error('Insufficient tokens');

      // Decrement token + meal qty
      beneficiary.tokenBalance -= 1;
      meal.qtyAvailable -= 1;
      await beneficiary.save({ session });
      await meal.save({ session });

      // Create order
      const order = await Order.create([{
        mealId: meal._id,
        beneficiaryId,
        memberId: meal.memberId,
        status: 'pending',
        costTokens: 1
      }], { session });

      res.status(201).json(order[0]);
    });
  } catch (e) {
    await session.abortTransaction();
    return res.status(400).json({ error: e.message });
  } finally {
    session.endSession();
  }
}

// Member accepts an order (token redemption is reflected by the pending→accepted state)
async function acceptOrder(req, res) {
  const memberId = req.user.id;
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, memberId });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'pending') return res.status(409).json({ error: 'Order not pending' });

  order.status = 'accepted';
  await order.save();
  res.json(order);
}

// Get orders by role (minimal dashboard feed)
async function listOrders(req, res) {
  const role = req.query.role;
  if (role === 'member') {
    const orders = await Order.find({ memberId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json(orders);
  }
  if (role === 'beneficiary') {
    const orders = await Order.find({ beneficiaryId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json(orders);
  }
  return res.status(400).json({ error: 'role query must be member|beneficiary' });
}

module.exports = { placeOrder, acceptOrder, listOrders };