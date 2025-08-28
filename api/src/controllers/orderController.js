// Order Controller

const mongoose = require('mongoose');
const Meal = require('../models/Meal');
const User = require('../models/User');
const Order = require('../models/Order');

// Beneficiary places an order (spend 1 token, decrement meal qty)
async function placeOrder(req, res) {
  try {
    const beneficiaryId = req.user.id;
    const { mealId } = req.body;

    // 1) Decrement meal qty if > 0
    const mealUpd = await Meal.updateOne(
      { _id: mealId, qtyAvailable: { $gt: 0 } },
      { $inc: { qtyAvailable: -1 } }
    );
    if (mealUpd.modifiedCount !== 1) {
      return res.status(400).json({ error: 'Meal unavailable' });
    }

    // 2) Decrement tokens if >= 1 and role=beneficiary
    const benUpd = await User.updateOne(
      { _id: beneficiaryId, role: 'beneficiary', tokenBalance: { $gte: 1 } },
      { $inc: { tokenBalance: -1 } }
    );
    if (benUpd.modifiedCount !== 1) {
      // roll back meal decrement
      await Meal.updateOne({ _id: mealId }, { $inc: { qtyAvailable: +1 } });
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // 3) Read the meal (to get memberId) and create order
    const meal = await Meal.findById(mealId).lean();
    const order = await Order.create({
      mealId,
      beneficiaryId,
      memberId: meal.memberId,
      status: 'pending',
      costTokens: 1
    });

    return res.status(201).json(order);
  } catch (e) {
    return res.status(400).json({ error: e.message });
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