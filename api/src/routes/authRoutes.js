//Auth Routes

const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authRequired } = require('../middleware/auth');
const { register, login, me, logout } = require('../controllers/authController');

// ROUTES
 router.post('/register',
    body('name').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['beneficiary', 'member']),
    validate,
    register
 );

 router.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    validate,
    login
 );

 router.get('/me', authRequired, me);
 router.post('/logout', authRequired, logout);

 module.exports = router;