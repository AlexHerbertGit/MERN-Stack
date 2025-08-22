// Meal Controller

const Meal = require('../models/Meal');

// For pulling all meal listing for display on the front end UI
async function listMeals(_req, res) {
  const meals = await Meal.find().lean();
  res.json(meals);
}

async function createMeal(req, res) {
  // Only members can create meals (enforced in route via role middleware)
  const { title, description, dietary = [], qtyAvailable = 0 } = req.body;
  const meal = await Meal.create({
    memberId: req.user.id,
    title, description, dietary, qtyAvailable
  });
  res.status(201).json(meal);
}

// (Optional) update/delete for completeness
async function updateMeal(req, res) {
  const { id } = req.params;
  const meal = await Meal.findOneAndUpdate(
    { _id: id, memberId: req.user.id },
    { $set: req.body },
    { new: true }
  );
  if (!meal) return res.status(404).json({ error: 'Meal not found' });
  res.json(meal);
}

module.exports = { listMeals, createMeal, updateMeal };