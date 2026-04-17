require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/listings/:id/reviews', reviewRoutes);

// root route so Render URL doesn't show 404
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'WanderLust API is live',
        health: '/health',
        apiHealth: '/api/health'
    });
});

// platform-friendly health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// simple health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// TODO: add proper error logging here (winston or something)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Something went wrong' });
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
