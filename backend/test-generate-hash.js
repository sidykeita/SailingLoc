const bcrypt = require('bcryptjs');

bcrypt.hash('admin123', 10).then(hash => {
  console.log('Hash généré pour admin123 :', hash);
});
