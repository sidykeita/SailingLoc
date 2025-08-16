console.log('--- DÉMARRAGE DU SCRIPT SEED-ADMIN ---');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/user');

const { MONGODB_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
  console.error('❌ Variables d\'environnement manquantes.');
  process.exit(1);
}

(async () => {
  try {
    console.log('Tentative de connexion à MongoDB avec URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connexion à MongoDB réussie');

    // Vérifie s'il existe déjà un admin (role: 'admin')
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.error(`❌ Un admin existe déjà : ${existingAdmin.email}`);
      process.exit(0);
    }
    console.log('Aucun admin existant, création en cours...');

    // Création de l'admin
    const hashedPassword = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
    const admin = new User({
      firstName: 'Admin',
      lastName: 'App',
      email: SEED_ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      phone: undefined
    });
    await admin.save();
    console.log(`✅ Admin créé avec succès : ${admin.email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed admin :', err);
    process.exit(1);
  }
})();
