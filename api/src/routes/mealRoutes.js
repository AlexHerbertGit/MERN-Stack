// Meal Routes

const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authRequired } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { listMeals, createMeal, updateMeal } = require('../controllers/mealController');

router.get('/', listMeals);
router.post('/',
  authRequired,
  requireRole('member'),
  body('title').isString().isLength({ min: 2 }),
  body('qtyAvailable').optional().isInt({ min: 0 }),
  validate,
  createMeal
);
router.put('/:id',
  authRequired,
  requireRole('member'),
  validate,
  updateMeal
);

module.exports = router;