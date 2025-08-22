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