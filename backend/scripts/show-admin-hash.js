// Script pour afficher le hash du mot de passe admin
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/user');

const { MONGODB_URI } = process.env;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const admin = await User.findOne({ role: 'admin', email: 'admin@admin.com' });
    if (!admin) {
      console.error('Aucun admin trouvé avec cet email.');
      process.exit(1);
    }
    console.log('Admin trouvé :');
    console.log('Email:', admin.email);
    console.log('Hash du mot de passe:', admin.password);
    console.log('Champs user:', admin);
    process.exit(0);
  } catch (err) {
    console.error('Erreur :', err);
    process.exit(1);
  }
})();
