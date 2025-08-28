//Server.js Server configuration

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./db');
const setupSwagger = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

//CORS (front-end integration)
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);

//Basic healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));

//Error Handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500 ).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
});

// Initiate Swagger
setupSwagger(app);