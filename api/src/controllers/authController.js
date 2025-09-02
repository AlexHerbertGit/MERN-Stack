// Auth Controller

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signJwt(userId, role) {
    return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

// User Registration function, encrypts user password and stores the hashed version.
async function register(req, res) {
    const { name, email, password, role } = req.body;
    if (!['beneficiary', 'member'].includes(role)) return res.status(422).json({ error: 'Invalid role'});

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const tokenBalance = role === 'beneficiary' ? 10 : 0; //seed the token balance for beneficiary registration.
    const user = await User.create({ name, email, passwordHash, role, tokenBalance });

    const token = signJwt(user._id.toString(), role);
    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60 * 1000
    });

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, tokenBalance: user.tokenBalance });
}

// Login function for verifying user credentials and requesting user account details, uses JWT.
async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signJwt(user._id.toString(), user.role);
    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60* 1000
    });

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, tokenBalance: user.tokenBalance });
}

// Requests user data.
async function me(req, res) {
    res.json(req.user);
}

// Logout function, clears session data and removes JWT token.
async function logout(_req, res) {
    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production'});
    res.json({ ok: true });
}

module.exports = { register, login, me, logout };