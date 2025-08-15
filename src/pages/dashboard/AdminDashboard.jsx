import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Layout';
import '../../assets/css/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBoats: 0,
    totalReservations: 0,
    totalRevenue: 0,
    pendingValidations: 0
  });

  useEffect(() => {
    // Mock data - remplacer par de vrais appels API
    setStats({
      totalUsers: 1247,
      totalBoats: 89,
      totalReservations: 342,
      totalRevenue: 125430,
      pendingValidations: 12
    });

    setUsers([
      { id: 1, name: 'Jean Dupont', email: 'jean@email.com', type: 'locataire', status: 'actif', joinDate: '2024-01-15' },
      { id: 2, name: 'Marie Martin', email: 'marie@email.com', type: 'propriétaire', status: 'actif', joinDate: '2024-02-20' },
      { id: 3, name: 'Pierre Bernard', email: 'pierre@email.com', type: 'locataire', status: 'banni', joinDate: '2024-03-10' }
    ]);

    setBoats([
      { id: 1, name: 'Océan Bleu', owner: 'Marie Martin', type: 'Voilier', status: 'validé', price: 150, location: 'Nice' },
      { id: 2, name: 'Liberté', owner: 'Paul Durand', type: 'Catamaran', status: 'en_attente', price: 280, location: 'Cannes' }
    ]);

    setReservations([
      { id: 1, boat: 'Océan Bleu', tenant: 'Jean Dupont', dates: '15-20 Aug 2024', amount: 750, status: 'confirmée' },
      { id: 2, boat: 'Liberté', tenant: 'Sophie Blanc', dates: '22-25 Aug 2024', amount: 840, status: 'en_attente' }
    ]);

    setReviews([
      { id: 1, boat: 'Océan Bleu', reviewer: 'Jean Dupont', rating: 5, comment: 'Excellent bateau !', date: '2024-08-21' },
      { id: 2, boat: 'Liberté', reviewer: 'Sophie Blanc', rating: 4, comment: 'Très bien mais...', date: '2024-08-26' }
    ]);
  }, []);

  const renderOverview = () => (
    <div className="admin-overview">
      <h2>Vue d'ensemble</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Utilisateurs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⛵</div>
          <div className="stat-info">
            <h3>{stats.totalBoats}</h3>
            <p>Bateaux</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.totalReservations}</h3>
            <p>Réservations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats.totalRevenue.toLocaleString()}€</h3>
            <p>Chiffre d'affaires</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="action-buttons">
          <button className="action-btn warning">
            <span className="badge">{stats.pendingValidations}</span>
            Validations en attente
          </button>
          <button className="action-btn" onClick={() => setActiveSection('users')}>
            Gérer les utilisateurs
          </button>
          <button className="action-btn" onClick={() => setActiveSection('boats')}>
            Gérer les bateaux
          </button>
          <button className="action-btn" onClick={() => setActiveSection('payments')}>
            Gérer les paiements
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Activité récente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">👤</span>
            <span>Nouvel utilisateur inscrit : Sophie Blanc</span>
            <span className="activity-time">Il y a 2h</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">⛵</span>
            <span>Nouveau bateau en attente de validation</span>
            <span className="activity-time">Il y a 4h</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">💰</span>
            <span>Paiement reçu : 750€</span>
            <span className="activity-time">Il y a 6h</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des utilisateurs</h2>
        <div className="section-actions">
          <button className="btn-primary">Ajouter un utilisateur</button>
          <button className="btn-secondary">Exporter</button>
        </div>
      </div>

      <div className="filters">
        <select>
          <option value="">Tous les types</option>
          <option value="locataire">Locataires</option>
          <option value="propriétaire">Propriétaires</option>
        </select>
        <select>
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="banni">Banni</option>
          <option value="suspendu">Suspendu</option>
        </select>
        <input type="text" placeholder="Rechercher un utilisateur..." />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.type}`}>{user.type}</span>
                </td>
                <td>
                  <span className={`status ${user.status}`}>{user.status}</span>
                </td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Voir">👁️</button>
                    <button className="btn-icon" title="Modifier">✏️</button>
                    <button className="btn-icon" title="Bannir">🚫</button>
                    <button className="btn-icon danger" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBoats = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des bateaux</h2>
        <div className="section-actions">
          <button className="btn-primary">Ajouter un bateau</button>
          <button className="btn-secondary">Exporter</button>
        </div>
      </div>

      <div className="filters">
        <select>
          <option value="">Tous les types</option>
          <option value="voilier">Voilier</option>
          <option value="catamaran">Catamaran</option>
          <option value="yacht">Yacht</option>
        </select>
        <select>
          <option value="">Tous les statuts</option>
          <option value="validé">Validé</option>
          <option value="en_attente">En attente</option>
          <option value="refusé">Refusé</option>
        </select>
        <input type="text" placeholder="Rechercher un bateau..." />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Propriétaire</th>
              <th>Type</th>
              <th>Prix/jour</th>
              <th>Localisation</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {boats.map(boat => (
              <tr key={boat.id}>
                <td>{boat.name}</td>
                <td>{boat.owner}</td>
                <td>{boat.type}</td>
                <td>{boat.price}€</td>
                <td>{boat.location}</td>
                <td>
                  <span className={`status ${boat.status}`}>{boat.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Voir">👁️</button>
                    <button className="btn-icon" title="Modifier">✏️</button>
                    <button className="btn-icon" title="Valider">✅</button>
                    <button className="btn-icon danger" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReservations = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des réservations</h2>
        <div className="section-actions">
          <button className="btn-secondary">Exporter</button>
        </div>
      </div>

      <div className="filters">
        <select>
          <option value="">Tous les statuts</option>
          <option value="confirmée">Confirmée</option>
          <option value="en_attente">En attente</option>
          <option value="annulée">Annulée</option>
        </select>
        <input type="date" />
        <input type="text" placeholder="Rechercher..." />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Bateau</th>
              <th>Locataire</th>
              <th>Dates</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{reservation.boat}</td>
                <td>{reservation.tenant}</td>
                <td>{reservation.dates}</td>
                <td>{reservation.amount}€</td>
                <td>
                  <span className={`status ${reservation.status}`}>{reservation.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Voir">👁️</button>
                    <button className="btn-icon" title="Modifier">✏️</button>
                    <button className="btn-icon" title="Rembourser">💰</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des avis</h2>
        <div className="section-actions">
          <button className="btn-secondary">Exporter</button>
        </div>
      </div>

      <div className="filters">
        <select>
          <option value="">Toutes les notes</option>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="2">2 étoiles</option>
          <option value="1">1 étoile</option>
        </select>
        <input type="text" placeholder="Rechercher..." />
      </div>

      <div className="reviews-grid">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h4>{review.boat}</h4>
              <div className="review-rating">
                {'⭐'.repeat(review.rating)}
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-footer">
              <span>Par {review.reviewer}</span>
              <span>{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div className="review-actions">
              <button className="btn-icon" title="Approuver">✅</button>
              <button className="btn-icon danger" title="Supprimer">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Gestion des paiements</h2>
        <div className="section-actions">
          <button className="btn-primary">Nouveau remboursement</button>
        </div>
      </div>

      <div className="payment-actions">
        <div className="action-card">
          <h3>Remboursements</h3>
          <p>Gérer les demandes de remboursement</p>
          <button className="btn-secondary">Voir les demandes (3)</button>
        </div>
        <div className="action-card">
          <h3>Paiements en attente</h3>
          <p>Valider les paiements en cours</p>
          <button className="btn-secondary">Voir les paiements (7)</button>
        </div>
        <div className="action-card">
          <h3>Litiges</h3>
          <p>Résoudre les litiges de paiement</p>
          <button className="btn-secondary">Voir les litiges (2)</button>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch(activeSection) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'boats': return renderBoats();
      case 'reservations': return renderReservations();
      case 'reviews': return renderReviews();
      case 'payments': return renderPayments();
      default: return renderOverview();
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="admin-sidebar">
            <div className="admin-profile">
              <div className="admin-avatar">👨‍💼</div>
              <h3>Admin</h3>
              <p>Administrateur</p>
            </div>

            <nav className="admin-nav">
              <button 
                className={activeSection === 'overview' ? 'active' : ''}
                onClick={() => setActiveSection('overview')}
              >
                📊 Vue d'ensemble
              </button>
              <button 
                className={activeSection === 'users' ? 'active' : ''}
                onClick={() => setActiveSection('users')}
              >
                👥 Utilisateurs
              </button>
              <button 
                className={activeSection === 'boats' ? 'active' : ''}
                onClick={() => setActiveSection('boats')}
              >
                ⛵ Bateaux
              </button>
              <button 
                className={activeSection === 'reservations' ? 'active' : ''}
                onClick={() => setActiveSection('reservations')}
              >
                📅 Réservations
              </button>
              <button 
                className={activeSection === 'payments' ? 'active' : ''}
                onClick={() => setActiveSection('payments')}
              >
                💰 Paiements
              </button>
              <button 
                className={activeSection === 'reviews' ? 'active' : ''}
                onClick={() => setActiveSection('reviews')}
              >
                ⭐ Avis
              </button>
            </nav>
          </div>

          <div className="admin-content">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
