const Review = require('../models/review');

// Créer une review
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    return res.status(201).json(review);
  } catch (err) {
    // Duplication (unique index reservation+user)
    if (err && (err.code === 11000 || err.name === 'MongoServerError')) {
      return res.status(409).json({ message: 'Vous avez déjà laissé un avis pour cette réservation.' });
    }
    // Erreurs de validation mongoose
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Erreur serveur lors de la création de l\'avis.' });
  }
};

// Récupérer toutes les reviews (avec filtres)
exports.getReviews = async (req, res) => {
  try {
    const { tenant, author, boat } = req.query;

    // Base query
    let query = {};
    if (author) query.user = author; // auteur de l'avis

    // On récupère et populate pour fournir les infos nécessaires au front
    let reviews = await Review.find(query)
      .populate({
        path: 'reservation',
        populate: [
          { path: 'boat' },
          { path: 'user' }
        ]
      })
      .exec();

    // Filtrer par locataire (avis reçus par un utilisateur)
    if (tenant) {
      reviews = reviews.filter(r => String(r?.reservation?.user?._id || r?.reservation?.user) === String(tenant));
    }

    // Filtrer par bateau (avis d'un bateau)
    if (boat) {
      reviews = reviews.filter(r => String(r?.reservation?.boat?._id || r?.reservation?.boat) === String(boat));
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer mes reviews (avis donnés par l'utilisateur connecté)
exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const reviews = await Review.find({ user: userId })
      .populate({
        path: 'reservation',
        populate: [
          { path: 'boat' },
          { path: 'user' }
        ]
      })
      .exec();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une review par ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review non trouvée" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier une review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: "Review non trouvée" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review non trouvée" });
    res.json({ message: "Review supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Répondre à une review (par le propriétaire)
exports.addOwnerResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const authorId = req.user && (req.user.id || req.user._id);
    if (!authorId) return res.status(401).json({ message: 'Non authentifié' });
    if (!text || !text.trim()) return res.status(400).json({ message: 'Texte de réponse manquant' });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review non trouvée' });

    review.ownerResponse = {
      text: text.trim(),
      author: authorId,
      createdAt: new Date()
    };
    await review.save();

    // Retourner la review mise à jour (optionnellement peuplée)
    const populated = await Review.findById(id)
      .populate({
        path: 'reservation',
        populate: [
          { path: 'boat' },
          { path: 'user' }
        ]
      })
      .exec();

    res.json(populated || review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
