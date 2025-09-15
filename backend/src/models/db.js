const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // In tests, never attempt to connect
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Allow either MONGO_URI or MONGODB_URI
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.warn('⚠️  Skipping MongoDB connect: MONGO_URI is not set');
      return;
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB :', uri);
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB :', error.message);
    // Do not hard-exit during tests or when invoked by tooling
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
