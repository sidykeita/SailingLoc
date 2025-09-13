import api from './api.service';

class MessageService {
  // Récupérer les dernières réponses des propriétaires pour un utilisateur
  async getOwnerReplies(userId) {
    try {
      const response = await api.get(`/reviews?tenant=${userId}`);
      
      // Filtrer les avis qui ont des réponses de propriétaires
      const repliesData = response.data
        .filter(review => review.ownerResponse && review.ownerResponse.text)
        .map(review => ({
          id: review._id,
          originalComment: review.comment,
          ownerReply: review.ownerResponse.text,
          boatName: review.reservation?.boat?.name || 'Bateau',
          ownerName: review.ownerResponse.author?.firstName || 'Propriétaire',
          replyDate: review.ownerResponse.createdAt,
          rating: review.rating
        }))
        .sort((a, b) => new Date(b.replyDate) - new Date(a.replyDate))
        .slice(0, 5); // Limiter aux 5 dernières réponses

      return repliesData;
    } catch (error) {
      console.error('Error fetching owner replies:', error);
      throw error;
    }
  }
}

export default new MessageService();
