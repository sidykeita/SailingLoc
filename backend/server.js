const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const connectDB = require('./src/models/db');

// ✅ Domaines autorisés (fixes) + toutes les previews Vercel via RegExp
const allowedOrigins = [
  'https://dsp-dev023-g5.vercel.app',
  'https://sailing-loc.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/
];

// En prod derrière proxy (Render), nécessaire pour les cookies "secure"
app.set('trust proxy', 1);

// ✅ CORS dynamique + cookies
app.use(cors({
  origin(origin, callback) {
    // autorise requêtes sans Origin (ex: curl/Postman, cron)
    if (!origin) return callback(null, true);
    const ok = allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
    return ok ? callback(null, true) : callback(new Error('CORS blocked'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Réponse aux prévols OPTIONS partout (avant les routes)
app.options('*', cors());
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

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

app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});


app.get('/', (req, res) => {
    res.send('API SailingLoc fonctionne ! 🚀');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
