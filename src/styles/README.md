# Structure CSS de SailingLoc

Ce document décrit l'organisation des styles CSS dans le projet SailingLoc.

## Architecture des styles

### Fichiers principaux

- **variables.css** : Contient toutes les variables CSS globales (couleurs, polices, etc.)
- **auth-common.css** : Styles partagés entre toutes les pages d'authentification
- **Background.css** : Gestion de l'arrière-plan global de l'application

### Fichiers spécifiques aux pages

- **pages/auth/Login.css** : Styles spécifiques à la page de connexion
- **pages/auth/Register.css** : Styles spécifiques à la page d'inscription
- **pages/auth/RegisterHome.css** : Styles spécifiques à la page d'accueil d'inscription

## Convention de nommage

- Classes génériques : `.btn`, `.form-group`, etc.
- Classes spécifiques à une page : `.login-container`, `.register-home-box`, etc.
- Classes de composants : `.auth-form-container`, `.auth-title`, etc.

## Utilisation des variables CSS

Toutes les couleurs et polices sont définies comme variables CSS dans `variables.css` et doivent être utilisées via `var(--nom-variable)` plutôt que de coder en dur les valeurs.

## Intégration avec Tailwind CSS

Le projet utilise également Tailwind CSS. Les directives `@tailwind` dans `index.css` permettent d'intégrer les styles Tailwind.

## Bonnes pratiques

1. Éviter la duplication de code CSS
2. Utiliser les variables CSS pour la cohérence
3. Organiser les styles par composant ou par page
4. Commenter les sections importantes du code CSS
