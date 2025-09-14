const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./models/db');
const stripeController = require('./controllers/stripeController');

const app = express();

app.use(cors({
  origin: [
    'https://dsp-dev023-g5.vercel.app',
    'https://sailing-loc.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Stripe webhook must use raw body parser ONLY on this route
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeController.webhook);

// JSON parser for all other routes
app.use(express.json());

// Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const boatRoutes = require('./routes/boatRoutes');
app.use('/api/boats', boatRoutes);

const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const photoRoutes = require('./routes/photoRoutes');
app.use('/api/photos', photoRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const stripeRoutes = require('./routes/stripeRoutes');
app.use('/api/stripe', stripeRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);

// Blocages calendrier
const blockedDateRoutes = require('./routes/blockedDate.routes');
app.use('/api/blocks', blockedDateRoutes);

const contractualDocumentRoutes = require('./routes/contractualDocumentRoutes');
app.use('/api/contractual-documents', contractualDocumentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('API SailingLoc fonctionne ! 🚀');
});

module.exports = app;