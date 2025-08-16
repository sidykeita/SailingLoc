const bcrypt = require('bcryptjs');

const password = 'admin123';

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Hash généré :', hash);
    return bcrypt.compare(password, hash);
  })
  .then(result => {
    console.log('Résultat comparaison (même session) :', result);
  })
  .catch(err => {
    console.error('Erreur bcrypt:', err);
  });