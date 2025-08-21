// Auth Middleware

const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authRequired(req, res, next) {
    try {
        const bearer = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null;

        const token = req.cookies?.jwt || bearer;
        if (!token) return res.status(401).json({ error: "Unauthenticated" });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).lean();
        if (!user) return res.status(401).json({ error: 'User not found' });
        
        req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token'});
    }
}

module.exports = { authRequired };