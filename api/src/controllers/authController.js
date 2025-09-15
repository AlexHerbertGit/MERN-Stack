// Auth Controller
// Handles registration, login (issues JWT), getting the current user data, and logging out users (clears JWT).
// The JWT is sent to the client (cookie or Bearer token) that is then verified using protected routes.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utility function for signing JWT containing the users ID and role.
// 'sub' holds the user ID by convention.
// 'role' enables quick authorization checks later in middleware functions.
function signJwt(userId, role) {
    return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

// Post /api/auth/register
// User Registration function, encrypts user password and stores the hashed version.
// Creates an new user. Hashes the password, assigns initial tokenBalance for beneficiaries.
// Returns a minimal user payload + sets JWT cookie.
async function register(req, res) {
    const { name, email, password, role } = req.body;
    if (!['beneficiary', 'member'].includes(role)) return res.status(422).json({ error: 'Invalid role'});

    // Prevents duplicate emails.
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    // Hashes the password using bcrypt.
    const passwordHash = await bcrypt.hash(password, 10);
    const tokenBalance = role === 'beneficiary' ? 10 : 0; //seed the token balance for beneficiary registration.
    const user = await User.create({ name, email, passwordHash, role, tokenBalance });

    // Issues a JWT for newly created accounts and seeds the token balance for beneficiaries.
    const token = signJwt(user._id.toString(), role);
    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60 * 1000
    });

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, tokenBalance: user.tokenBalance });
}

// POST api/auth/login
// Login function for verifying user credentials and requesting user account details, sets a JWT cookie.
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

// GET /api/auth/me
// Requests user data and returns the current authenticated user.
async function me(req, res) {
    res.json(req.user);
}

// POST /api/auth/logout
// Logout function, clears session data and removes JWT token, ends the session.
async function logout(_req, res) {
    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production'});
    res.json({ ok: true });
}

module.exports = { register, login, me, logout };