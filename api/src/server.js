//Server.js Server configuration
// Sets up the Express app, CORS for client, JSON Parsing, and cookies.
// Establishes routes for auth/meals/orders, health check, and final error handler.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./db');
const setupSwagger = require('./swagger');

// Route modules 
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

//CORS (front-end integration) - Allows the front end dev origin to send credentials (cookies) to the API.
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Parse JSON request bodies and cookies for auth.
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);

//Basic healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));

//Error Handler - centralized error handler to avoid duplicate try/catches in route handlers.
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500 ).json({ error: err.message || 'Server error' });
});

// Starts the server once the DB connection is established.
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
});

// Initiate Swagger
setupSwagger(app);