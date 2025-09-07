/**
 * Configuration des options de paiement
 */

export const paymentConfig = {
  // Frais de service en pourcentage (10%)
  serviceFeePercentage: 10,
  
  // Dépôt de garantie en pourcentage du montant total (20%)
  depositPercentage: 20,
  
  // Devise par défaut
  defaultCurrency: 'eur',
  
  // Options de paiement disponibles
  paymentMethods: [
    'card',
    'sepa_debit',
    'sofort',
    'giropay',
    'bancontact',
    'eps',
    'ideal',
    'p24'
  ],
  
  // Options de paiement par pays
  countrySpecificPaymentMethods: {
    fr: ['card', 'sepa_debit', 'sofort', 'giropay', 'bancontact'],
    de: ['card', 'sofort', 'giropay', 'eps'],
    nl: ['card', 'ideal'],
    be: ['card', 'bancontact'],
    es: ['card', 'sofort'],
    it: ['card', 'sofort'],
    at: ['card', 'eps', 'sofort'],
    ch: ['card', 'sofort'],
    pl: ['card', 'p24']
  },
  
  // Options de livraison (pour les biens physiques)
  shippingOptions: [
    {
      id: 'standard',
      label: 'Livraison standard',
      detail: 'Livraison sous 3-5 jours ouvrés',
      amount: 0 // Frais de livraison en centimes
    },
    {
      id: 'express',
      label: 'Livraison express',
      detail: 'Livraison sous 24h',
      amount: 1000 // 10.00 EUR
    }
  ],
  
  // Options de remboursement
  refundPolicy: {
    // Délai de rétractation en jours (14 jours pour la France/UE)
    cancellationPeriod: 14,
    
    // Conditions de remboursement
    conditions: {
      fullRefund: 'Annulation jusqu\'à 7 jours avant la date de début',
      partialRefund: 'Remboursement à 50% si annulation entre 7 et 3 jours avant',
      noRefund: 'Aucun remboursement si annulation moins de 3 jours avant'
    }
  },
  
  // Configuration des taxes (TVA)
  taxRates: {
    standard: {
      percentage: 20, // Taux de TVA standard en pourcentage
      displayName: 'TVA 20%',
      inclusive: false // La TVA est ajoutée au prix affiché
    },
    reduced: {
      percentage: 10,
      displayName: 'TVA réduite 10%',
      inclusive: false
    },
    zero: {
      percentage: 0,
      displayName: 'TVA 0%',
      inclusive: true
    }
  },
  
  // Configuration des frais de transaction
  transactionFees: {
    stripe: {
      // Frais Stripe: 1.4% + 0.25€ par transaction réussie
      percentage: 1.4,
      fixed: 25 // En centimes (0.25€)
    },
    platform: {
      // Frais de plateforme: 2.9% + 0.30€ par transaction
      percentage: 2.9,
      fixed: 30 // En centimes (0.30€)
    }
  },
  
  // Configuration des webhooks Stripe
  webhookConfig: {
    // URL de base pour les webhooks (peut être surchargée dans les variables d'environnement)
    baseUrl: process.env.VITE_APP_URL || 'http://localhost:3000',
    
    // Événements à écouter
    events: [
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'charge.refunded',
      'charge.dispute.created',
      'charge.dispute.closed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted'
    ]
  },
  
  // Options de facturation
  billing: {
    // Adresse de facturation requise
    billingAddressRequired: true,
    
    // Champs de facturation obligatoires
    requiredBillingFields: [
      'name',
      'email',
      'address.line1',
      'address.city',
      'address.postal_code',
      'address.country'
    ]
  },
  
  // Configuration des devises supportées
  supportedCurrencies: ['eur', 'usd', 'gbp', 'chf'],
  
  // Taux de change (mise à jour périodiquement via une API)
  exchangeRates: {
    eur: 1.0,
    usd: 1.08, // Exemple de taux, à mettre à jour via une API
    gbp: 0.86,
    chf: 0.95
  },
  
  // Configuration des méthodes de paiement récurrentes
  recurringPayments: {
    // Périodes d'essai gratuites (en jours)
    trialPeriods: {
      monthly: 0,
      yearly: 14,
      lifetime: 0
    },
    
    // Options d'abonnement
    subscriptionPlans: [
      {
        id: 'basic',
        name: 'Basic',
        price: 990, // 9.90€ en centimes
        interval: 'month',
        features: [
          'Accès de base',
          'Support par email',
          'Mises à jour régulières'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 2490, // 24.90€ en centimes
        interval: 'month',
        features: [
          'Toutes les fonctionnalités Basic',
          'Support prioritaire',
          'Accès anticipé aux nouvelles fonctionnalités',
          'Statistiques avancées'
        ]
      },
      {
        id: 'enterprise',
        name: 'Entreprise',
        price: 9990, // 99.90€ en centimes
        interval: 'month',
        features: [
          'Toutes les fonctionnalités Pro',
          'Support 24/7',
          'Configuration personnalisée',
          'Formation dédiée',
          'Compte dédié'
        ]
      }
    ]
  },
  
  // Configuration des notifications
  notifications: {
    // Notifications par email
    email: {
      paymentSuccess: true,
      paymentFailed: true,
      refundIssued: true,
      subscriptionRenewal: true,
      subscriptionCancelled: true
    },
    
    // Notifications in-app
    inApp: {
      paymentSuccess: true,
      paymentFailed: true,
      refundIssued: true,
      subscriptionRenewal: true,
      subscriptionCancelled: true
    },
    
    // Notifications push (si activées)
    push: {
      paymentSuccess: true,
      paymentFailed: true,
      refundIssued: true,
      subscriptionRenewal: true,
      subscriptionCancelled: true
    }
  },
  
  // Configuration des limites de paiement
  paymentLimits: {
    // Montant minimum en centimes (1€)
    minimumAmount: 100,
    
    // Montant maximum en centimes (10 000€)
    maximumAmount: 1000000,
    
    // Limites par méthode de paiement
    perMethod: {
      card: {
        minimumAmount: 50, // 0.50€
        maximumAmount: 500000 // 5 000€
      },
      sepa_debit: {
        minimumAmount: 100, // 1€
        maximumAmount: 1000000 // 10 000€
      },
      sofort: {
        minimumAmount: 100, // 1€
        maximumAmount: 500000 // 5 000€
      }
    }
  },
  
  // Configuration des devises acceptées par pays
  countryCurrencies: {
    fr: 'eur',
    de: 'eur',
    es: 'eur',
    it: 'eur',
    nl: 'eur',
    be: 'eur',
    lu: 'eur',
    at: 'eur',
    ie: 'eur',
    pt: 'eur',
    fi: 'eur',
    gr: 'eur',
    us: 'usd',
    gb: 'gbp',
    ch: 'chf',
    ca: 'cad',
    jp: 'jpy',
    au: 'aud',
    nz: 'nzd'
  },
  
  // Configuration des langues supportées
  supportedLanguages: ['fr', 'en', 'de', 'es', 'it', 'nl', 'pt'],
  
  // Messages d'erreur personnalisés
  errorMessages: {
    card_declined: 'Votre carte a été refusée. Veuillez réessayer ou utiliser un autre moyen de paiement.',
    expired_card: 'Votre carte a expiré. Veuillez utiliser une autre carte.',
    insufficient_funds: 'Solde insuffisant. Veuillez utiliser une autre carte ou contacter votre banque.',
    stolen_card: 'Cette carte a été signalée comme volée. Veuillez utiliser une autre carte.',
    incorrect_cvc: 'Le code de sécurité est incorrect. Veuillez réessayer.',
    processing_error: 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.',
    invalid_expiry_month: 'Le mois d\'expiration est invalide.',
    invalid_expiry_year: 'L\'année d\'expiration est invalide.',
    invalid_cvc: 'Le code de sécurité est invalide.',
    invalid_number: 'Le numéro de carte est invalide.',
    incorrect_number: 'Le numéro de carte est incorrect.',
    incorrect_zip: 'Le code postal est incorrect.'
  }
};

export default paymentConfig;
