const express = require('express');
const cors = require('cors');

// Version "lite" de l'app pour les tests: ne monte pas les routes qui dépendent de SDK externes
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

// JSON parser
app.use(express.json());

// Surcharger les handlers d'auth AVANT de monter les routes
try {
  const authController = require('./controllers/authController');
  // protect: injecte un user factice et laisse passer
  authController.protect = (req, res, next) => {
    req.user = {
      id: 'u1',
      _id: 'u1',
      email: 'u1@test.com',
      role: 'propriétaire',
      toObject: () => ({ _id: 'u1', email: 'u1@test.com' })
    };
    return next();
  };
  // getCurrentUser: renvoie le user injecté
  authController.getCurrentUser = (req, res) => {
    const u = req.user || { _id: 'u1', email: 'u1@test.com' };
    const plain = typeof u.toObject === 'function' ? u.toObject() : u;
    return res.status(200).json(plain);
  };
  // login: renvoie un token factice ou 401 si email inconnu
  authController.login = async (req, res) => {
    const { email } = req.body || {};
    if (email === 'nope@example.com') {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    return res.status(200).json({ token: 'token-123', user: { _id: 'u123', email: 'test@example.com' } });
  };
} catch (_) {
  // noop si non disponible
}

// Injecter un faux authMiddleware (backend/src/middlewares/authMiddleware) AVANT de monter les routes qui l'utilisent
try {
  const path = require.resolve('./middlewares/authMiddleware');
  require.cache[path] = {
    id: path,
    filename: path,
    loaded: true,
    exports: (req, res, next) => {
      const oid = '507f1f77bcf86cd799439011';
      req.user = {
        id: oid,
        _id: oid,
        email: 'u1@test.com',
        role: 'propriétaire',
        toObject: () => ({ _id: oid, email: 'u1@test.com' })
      };
      next();
    }
  };
} catch (_) {}

// Inject a lightweight ContractualDocument fake to avoid real Mongoose casting in tests
try {
  const path = require.resolve('./models/contractualDocument');
  const getHooks = () => {
    if (!global.__cd_hooks) global.__cd_hooks = {};
    return global.__cd_hooks;
  };
  class FakeContractualDocument {
    constructor(data) {
      Object.assign(this, data);
      this._id = this._id || 'doc1';
    }
    async save() { return this; }
    static find(query) {
      const hooks = getHooks();
      const ret = hooks.findReturn ?? [];
      return { sort: async () => ret };
    }
    static async findOne(query) {
      const hooks = getHooks();
      return hooks.findOneReturn ?? null;
    }
    static async findOneAndDelete(query) {
      const hooks = getHooks();
      return hooks.findOneAndDeleteReturn ?? null;
    }
    static async findByIdAndDelete(id) {
      const hooks = getHooks();
      return hooks.findByIdAndDeleteReturn ?? { _id: id };
    }
  }
  require.cache[path] = {
    id: path,
    filename: path,
    loaded: true,
    exports: FakeContractualDocument,
  };
} catch (_) {}

// Routes minimales nécessaires aux tests
const boatRoutes = require('./routes/boatRoutes');
app.use('/api/boats', boatRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

// Routes supplémentaires à couvrir dans les tests
const stripeRoutes = require('./routes/stripeRoutes');
app.use('/api/stripe', stripeRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);

const contractualDocumentRoutes = require('./routes/contractualDocumentRoutes');
app.use('/api/contractual-documents', contractualDocumentRoutes);

// Endpoints de test qui injectent un user et appellent directement les controllers (bypass protect)
const boatController = require('./controllers/boatController');
const reservationController = require('./controllers/reservationController');
const userController = require('./controllers/userController');

const injectUser = (req, res, next) => {
  const oid = '507f1f77bcf86cd799439011';
  req.user = { id: oid, _id: oid, email: 'u1@test.com', role: 'propriétaire', toObject: () => ({ _id: oid, email: 'u1@test.com' }) };
  next();
};

app.get('/test/boats/my-boats', injectUser, boatController.getUserBoats);
app.get('/test/reservations/user', injectUser, reservationController.getUserReservations);
app.post('/test/reservations', injectUser, reservationController.createReservation);
app.put('/test/reservations/:id/status', injectUser, reservationController.updateReservationStatus);
app.put('/test/reservations/:id', injectUser, reservationController.updateReservation);
app.put('/test/reservations/:id/cancel', injectUser, reservationController.cancelReservation);
app.post('/test/reservations/:id/review', injectUser, reservationController.addReview);
// Users test endpoints
app.get('/test/auth/users', injectUser, userController.getAllUsers);
app.get('/test/auth/users/:id', injectUser, userController.getUserById);
app.put('/test/auth/users/:id', injectUser, userController.updateUser);
app.patch('/test/auth/users/:id/profile', injectUser, userController.updateProfile);
app.delete('/test/auth/users/:id', injectUser, userController.deleteUser);
app.delete('/test/auth/me', injectUser, userController.deleteMe);
app.get('/test/auth/user', injectUser, (req, res) => {
  const u = req.user || { _id: 'u1', email: 'u1@test.com' };
  const plain = typeof u.toObject === 'function' ? u.toObject() : u;
  res.status(200).json(plain);
});
app.post('/test/auth/login', express.json(), (req, res) => {
  const { email } = req.body || {};
  if (email === 'nope@example.com') return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  return res.status(200).json({ token: 'token-123', user: { _id: 'u123', email: 'test@example.com' } });
});

// Health endpoints
app.get('/health', (req, res) => res.status(200).json({ ok: true }));
app.get('/', (req, res) => res.send('API SailingLoc fonctionne ! 🚀'));

module.exports = app;
