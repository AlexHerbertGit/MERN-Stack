// Order Routes

const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authRequired } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { placeOrder, acceptOrder, listOrders } = require('../controllers/orderController');

router.get('/', authRequired, listOrders);

router.post('/',
  authRequired,
  requireRole('beneficiary'),
  body('mealId').isString().isLength({ min: 1 }),
  validate,
  placeOrder
);

router.post('/:id/accept',
  authRequired,
  requireRole('member'),
  acceptOrder
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Token-based orders & acceptance
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders for the current user by role
 *     description: Use `?role=member` to see orders for the member; `?role=beneficiary` for the beneficiary.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: [member, beneficiary]
 *     responses:
 *       200:
 *         description: Array of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthenticated
 *       400:
 *         description: Missing/invalid role query
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order (beneficiary only) — spends 1 token and decrements meal qty
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceOrderInput'
 *     responses:
 *       201:
 *         description: Order created (pending)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation/business rule error (e.g., insufficient tokens, no qty)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Forbidden (requires beneficiary role)
 */

/**
 * @swagger
 * /orders/{id}/accept:
 *   post:
 *     summary: Accept an order (member only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Forbidden (requires member role)
 *       404:
 *         description: Order not found
 *       409:
 *         description: Order not pending
 */