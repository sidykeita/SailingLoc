// Script pour mettre à jour le mot de passe admin
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    const hashedPassword = await bcrypt.hash('admin', 10);
    admin.password = hashedPassword;
    await admin.save();
    console.log('Mot de passe admin mis à jour avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('Erreur :', err);
    process.exit(1);
  }
})();
