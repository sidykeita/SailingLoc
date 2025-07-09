# Utilise Node.js version 20
FROM node:20

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances avec --production pour l'environnement de production
RUN npm install --production

# Installe les dépendances de développement séparément
RUN npm install --save-dev nodemon jest mongoose

# Copie le reste du projet
COPY . .

# Expose le port de l'API
EXPOSE 5000

# Démarre le serveur
CMD ["npm", "run", "dev"]
