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

/**
 * @swagger
 * tags:
 *   - name: Meals
 *     description: Meals CRUD
 */

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: List all meals
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: Array of meals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 */

/**
 * @swagger
 * /meals:
 *   post:
 *     summary: Create a meal (member only)
 *     tags: [Meals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealInput'
 *     responses:
 *       201:
 *         description: Meal created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Forbidden (requires member role)
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /meals/{id}:
 *   put:
 *     summary: Update a meal (owner member only)
 *     tags: [Meals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealInput'
 *     responses:
 *       200:
 *         description: Updated meal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Forbidden (requires owner member)
 *       404:
 *         description: Meal not found
 */