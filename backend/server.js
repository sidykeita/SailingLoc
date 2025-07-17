const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/models/db');



const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/auth', authRoutes);

const boatRoutes = require('./src/routes/boatRoutes');
app.use('/api', boatRoutes);

const reservationRoutes = require('./src/routes/reservationRoutes');
app.use('/api', reservationRoutes);

app.get('/', (req, res) => {
    res.send('API SailingLoc fonctionne ! 🚀');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
