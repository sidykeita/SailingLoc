const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/models/db');



const app = express();
app.use(cors({
  origin: [
    'https://sailing-loc.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const boatRoutes = require('./src/routes/boatRoutes');
app.use('/api/boats', boatRoutes);

const reservationRoutes = require('./src/routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

const reviewRoutes = require('./src/routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const photoRoutes = require('./src/routes/photoRoutes');
app.use('/api/photos', photoRoutes);

const paymentRoutes = require('./src/routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

const ownerDocsRoutes = require('./src/routes/ownerDocs.routes');
app.use('/api/owner-docs', ownerDocsRoutes);

const favoriteRoutes = require('./src/routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);


app.get('/', (req, res) => {
    res.send('API SailingLoc fonctionne ! 🚀');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
