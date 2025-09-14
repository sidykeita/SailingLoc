require('dotenv').config();
const connectDB = require('./src/models/db');
const app = require('./src/app');

// Connexion à MongoDB (uniquement au démarrage serveur, pas en tests)
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
