const bcrypt = require('bcryptjs');
const hash = '$2b$10$QqQw8dVf0bZ6dA8lXlK3nO4/0VQYI3h2W3z5n0tP0x1lA2y7aQ1e2';

bcrypt.compare('admin123', hash).then(result => {
  console.log('Résultat comparaison admin123/hash:', result);
});
