# Intégration de Stripe pour les paiements

Ce document explique comment configurer et utiliser l'intégration de Stripe pour gérer les paiements sécurisés sur SailingLoc.

## Prérequis

- Un compte Stripe (https://dashboard.stripe.com/register)
- Les clés API Stripe (publique et secrète)
- Node.js 14+ et npm installés

## Configuration

1. **Installer les dépendances**
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet et ajoutez vos clés Stripe :
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
   VITE_STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
   ```

## Composants principaux

### 1. Formulaire de paiement

Le composant `StripePaymentForm` (`src/components/payment/StripePaymentForm.jsx`) gère :
- L'affichage du formulaire de carte bancaire
- La validation des données de carte
- La soumission sécurisée du paiement
- Les états de chargement et d'erreur

### 2. Page de paiement

La page `PaymentPage` (`src/pages/payment/PaymentPage.jsx`) affiche :
- Le récapitulatif de la réservation
- Le formulaire de paiement
- Les messages de succès/erreur

### 3. Service de paiement

Le service `payment.service.js` (`src/services/payment.service.js`) contient les méthodes pour :
- Créer une intention de paiement
- Confirmer un paiement
- Récupérer l'historique des paiements
- Effectuer des remboursements

## Flux de paiement

1. L'utilisateur sélectionne un bateau et des dates
2. Le système crée une intention de paiement côté serveur
3. L'utilisateur saisit ses informations de paiement
4. Stripe valide la carte et effectue une pré-autorisation
5. Le paiement est confirmé et la réservation est créée
6. L'utilisateur reçoit une confirmation par email

## Sécurité

- Les données de carte ne transitent jamais par nos serveurs
- Utilisation de HTTPS obligatoire
- Validation côté serveur de tous les paiements
- Journalisation des activités de paiement

## Tests

Pour tester en mode développement, utilisez les cartes de test Stripe :

- Carte valide : 4242 4242 4242 4242
- Date d'expiration : toute date future
- CVC : n'importe quel code à 3 chiffres

## Déploiement

1. Mettez à jour les clés d'API pour la production
2. Activez le mode production dans le tableau de bord Stripe
3. Configurez les webhooks pour les événements de paiement
4. Testez le processus de bout en bout avant la mise en production

## Support

Pour tout problème lié aux paiements, contactez support@stripe.com ou consultez la documentation officielle : https://stripe.com/docs
