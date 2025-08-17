import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Layout';
import '../../assets/css/AdminDashboard.css';
import userService from '../../services/user.service';
import boatService from '../../services/boat.service';
import reservationService from '../../services/reservation.service';
import reviewService from '../../services/review.service';
import EditUserModal from '../../components/EditUserModal';

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  // Handlers pour les actions utilisateur
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };
  const [editUser, setEditUser] = useState(null);
  const handleEditUser = (user) => {
    setEditUser(user);
  };
  const handleSaveEditUser = (data) => {
    // TODO : appeler l'API pour sauvegarder les changements
    setEditUser(null);
    // Optionnel : recharger la liste des users ou afficher une notification
  };
  const handleDeleteUser = (user) => {
    if(window.confirm(`Supprimer l'utilisateur ${user.name} ?`)) {
      alert('Suppression à implémenter');
    }
  };

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
    // Chargement dynamique des données depuis l'API
    const fetchData = async () => {
      try {
        // Utilisateurs
        const usersData = await userService.getAllUsers();
    console.log('usersData:', usersData);
        setUsers(usersData.map(u => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          type: u.role,
          status: u.status || 'actif',
          joinDate: u.createdAt || u.joinDate
        })));

        // Bateaux
        const boatsData = await boatService.getAllBoats();
    console.log('boatsData:', boatsData);
        setBoats(boatsData.map(b => ({
          id: b._id,
          name: b.name,
          owner: b.owner && (b.owner.firstName ? `${b.owner.firstName} ${b.owner.lastName}` : b.owner.name || b.owner),
          type: b.type,
          status: b.status,
          price: b.dailyPrice,
          location: b.port
        })));

        // Réservations
        const reservationsData = await reservationService.getAllReservations ? await reservationService.getAllReservations() : [];
        console.log('reservationsData:', reservationsData);
        console.log('reservationsData.length:', reservationsData.length);
        setReservations(reservationsData.map(r => ({
          id: r._id,
          boat: r.boat && (r.boat.name || r.boat),
          tenant: r.user && (r.user.firstName ? `${r.user.firstName} ${r.user.lastName}` : r.user.name || r.user),
          dates: r.startDate && r.endDate ? `${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}` : '',
          amount: r.price,
          status: r.status
        })));

        // Statistiques
        console.log('setStats values:', {
          totalUsers: usersData.length,
          totalBoats: boatsData.length,
          totalReservations: reservationsData.length,
          totalRevenue: reservationsData.reduce((acc, r) => acc + (r.totalPrice || r.amount || 0), 0),
          pendingValidations: boatsData.filter(b => b.status === 'en_attente').length
        });
        setStats({
          totalUsers: usersData.length,
          totalBoats: boatsData.length,
          totalReservations: reservationsData.length,
          totalRevenue: reservationsData.reduce((acc, r) => acc + (r.totalPrice || r.amount || 0), 0),
          pendingValidations: boatsData.filter(b => b.status === 'en_attente').length
        });

        // Avis (optionnel)
        try {
          const reviewsData = await reviewService.getAllReviews();
          console.log('reviewsData:', reviewsData);
          setReviews(reviewsData.map(rv => ({
            id: rv._id,
            boat: rv.boat && (rv.boat.name || rv.boat),
            reviewer: rv.user && (rv.user.firstName ? `${rv.user.firstName} ${rv.user.lastName}` : rv.user.name || rv.user),
            rating: rv.rating,
            comment: rv.comment,
            date: rv.createdAt || rv.date
          })));
        } catch (err) {
          console.warn('Erreur lors du chargement des reviews (non bloquant):', err);
          setReviews([]);
        }
      } catch (error) {
        // Gérer les erreurs (optionnel: afficher une notification)
        console.error('Erreur lors du chargement des données du dashboard :', error);
      }
    };
    fetchData();
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
            {users.filter(user => user.type !== 'admin').map(user => (
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
                    <button className="btn-icon" title="Voir" onClick={() => handleViewUser(user)}>👁️</button>
<button className="btn-icon" title="Modifier" onClick={() => handleEditUser(user)}>✏️</button>
<button className="btn-icon danger" title="Supprimer" onClick={() => handleDeleteUser(user)}>🗑️</button>
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
      // case 'payments': return renderPayments(); // Fonction non définie, à corriger ou implémenter si besoin.
      default: return renderOverview();
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        {selectedUser && (
          <div className="user-detail-drawer" style={{
            position: 'fixed', top: 0, right: 0, width: '350px', height: '100%', background: '#fff', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)', zIndex: 1000, padding: '32px 24px', transition: 'right 0.3s', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <button style={{alignSelf: 'flex-end', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer'}} onClick={() => setSelectedUser(null)}>✖️</button>
            <h2>Détail utilisateur</h2>
            <div><strong>Nom :</strong> {selectedUser.name}</div>
            <div><strong>Email :</strong> {selectedUser.email}</div>
            <div><strong>Type :</strong> {selectedUser.type}</div>
            <div><strong>Statut :</strong> {selectedUser.status}</div>
            <div><strong>Inscription :</strong> {new Date(selectedUser.joinDate).toLocaleDateString()}</div>
          </div>
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            open={!!editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSaveEditUser}
          />
        )}
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