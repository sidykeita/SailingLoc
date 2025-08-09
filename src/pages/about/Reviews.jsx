import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../../src/assets/css/Reviews.css';

const Reviews = () => {
  // Données factices pour les avis
  const reviews = [
    {
      id: 1,
      name: 'Sophie Martin',
      rating: 5,
      date: '15 juillet 2025',
      comment: 'Excellente expérience avec SailingLoc ! Le bateau était en parfait état et le service client très réactif. Je recommande vivement !',
      boat: 'Voilier Beneteau Oceanis 45',
      location: 'Marseille'
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      rating: 4,
      date: '2 août 2025',
      comment: 'Très bonne location, bateau confortable et bien équipé. Seul petit bémol : le check-in a pris un peu plus de temps que prévu.',
      boat: 'Catamaran Lagoon 42',
      location: 'Porto-Cristo'
    },
    {
      id: 3,
      name: 'Émilie Leclerc',
      rating: 5,
      date: '20 juin 2025',
      comment: 'Une semaine de rêve en mer ! Le bateau était impeccable et l\'équipe de SailingLoc très professionnelle. À refaire sans hésiter !',
      boat: 'Yacht Princess V50',
      location: 'Bastia'
    },
    {
      id: 4,
      name: 'Pierre Moreau',
      rating: 4,
      date: '5 juillet 2025',
      comment: 'Location très satisfaisante. Le bateau correspondait parfaitement à la description et l\'équipe a été très disponible pour répondre à nos questions.',
      boat: 'Semi-rigide Zodiac Medline 7.5',
      location: 'Alicante'
    },
    {
      id: 5,
      name: 'Julie Leroy',
      rating: 5,
      date: '12 août 2025',
      comment: 'Superbe expérience ! Le bateau était magnifique et parfaitement entretenu. Le processus de réservation était simple et efficace.',
      boat: 'Voilier Jeanneau Sun Odyssey 410',
      location: 'Corfou'
    }
  ];

  // Fonction pour générer les étoiles en fonction de la note
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i} 
          icon={faStar} 
          className={i < rating ? 'star-filled' : 'star-empty'} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="reviews-container">
      <div className="reviews-hero">
        <h1>Avis clients</h1>
        <div className="reviews-summary">
          <div className="rating-average">
            <span className="rating-number">4.8</span>
            <div className="rating-stars">
              {renderStars(5)}
            </div>
            <span className="rating-count">Basé sur plus de 5 000 avis</span>
          </div>
        </div>
      </div>

      <div className="reviews-content">
        <div className="reviews-filter">
          <h2>Filtrer les avis</h2>
          <div className="filter-options">
            <select className="filter-select">
              <option value="all">Tous les bateaux</option>
              <option value="sailboats">Voiliers</option>
              <option value="motorboats">Bateaux à moteur</option>
              <option value="catamarans">Catamarans</option>
            </select>
            <select className="filter-select">
              <option value="all">Toutes les destinations</option>
              <option value="marseille">Marseille</option>
              <option value="porto-cristo">Porto-Cristo</option>
              <option value="bastia">Bastia</option>
              <option value="alicante">Alicante</option>
              <option value="corfou">Corfou</option>
            </select>
            <select className="filter-select">
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
        </div>

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-user">
                  <div className="user-avatar">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="user-info">
                    <h3>{review.name}</h3>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="review-details">
                <p className="review-boat"><strong>Bateau :</strong> {review.boat}</p>
                <p className="review-location"><strong>Destination :</strong> {review.location}</p>
              </div>
              <div className="review-comment">
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-pagination">
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">4</button>
          <button className="pagination-btn">5</button>
          <button className="pagination-btn">Suivant</button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
