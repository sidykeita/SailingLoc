# Utilise Node.js version 20
FROM node:20

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe TOUTES les dépendances (prod + dev)
RUN npm install

# Copie le reste du projet
COPY . .

# Expose le port de l'API
EXPOSE 5000

# Démarre le serveur en mode dev (avec nodemon)
CMD ["npm", "run", "dev"]
