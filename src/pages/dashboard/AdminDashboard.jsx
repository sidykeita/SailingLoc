import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Layout';
import '../../assets/css/AdminDashboard.css';
import userService from '../../services/user.service';
import boatService from '../../services/boat.service';
import reservationService from '../../services/reservation.service';
import reviewService from '../../services/review.service';
import EditUserModal from '../../components/EditUserModal';
import BoatViewModal from '../../components/BoatViewModal';
import BoatEditModal from '../../components/BoatEditModal';
import ReservationDetailModal from '../../components/ReservationDetailModal';
import ReservationEditModal from '../../components/ReservationEditModal';

const AdminDashboard = () => {
  // ... états existants
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editReservation, setEditReservation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsRaw, setReservationsRaw] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBoats: 0,
    totalReservations: 0,
    totalRevenue: 0,
    pendingValidations: 0
  });

  // Génère les activités récentes à partir des users, boats et reservations
  useEffect(() => {
    // Supposons que users, boats, reservations sont déjà chargés via fetchData
    // et stockés dans des états users, boats, reservations
    const activities = [];
    if (Array.isArray(users)) {
      users.slice(-10).forEach(u => {
        activities.push({
          type: 'user',
          date: new Date(u.createdAt || u.joinDate),
          icon: '👤',
          text: `Nouvel utilisateur inscrit : ${u.firstName || ''} ${u.lastName || ''}`.trim(),
        });
      });
    }
    if (Array.isArray(boats)) {
      boats.slice(-10).forEach(b => {
        activities.push({
          type: 'boat',
          date: new Date(b.createdAt),
          icon: '⛵',
          text: `Nouveau bateau en attente de validation : ${b.name}`,
        });
      });
    }
    if (Array.isArray(reservations)) {
      reservations.slice(-10).forEach(r => {
        const commission = r.price ? (r.price * 0.10).toFixed(2) : null;
        activities.push({
          type: 'reservation',
          date: new Date(r.createdAt),
          icon: '💰',
          text: commission
            ? `Nouvelle réservation : ${r.boat?.name || 'Bateau'} - Commission : ${commission}€`
            : `Nouvelle réservation : ${r.boat?.name || 'Bateau'}`,
        });
      });
    }
    // Trie par date décroissante et limite à 5
    activities.sort((a, b) => b.date - a.date);
    const now = new Date();
    const withTimeAgo = activities.slice(0, 5).map(act => ({
      ...act,
      timeAgo: getTimeAgo(act.date, now),
    }));
    setRecentActivities(withTimeAgo);
  }, [users, boats, reservations]);

  // Helper pour afficher "il y a Xh/min"
  function getTimeAgo(date, now) {
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `Il y a ${diff}s`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return `Il y a ${Math.floor(diff / 86400)}j`;
  }

  // fetchData doit être déclaré ici pour être accessible dans les handlers
  const fetchData = async () => {
    try {
      // Utilisateurs
      const usersData = await userService.getAllUsers();
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
      setReservationsRaw(reservationsData);
      setReservations(reservationsData.map(r => ({
        id: r._id,
        boat: r.boat && (r.boat.name || r.boat),
        tenant: r.user && (r.user.firstName ? `${r.user.firstName} ${r.user.lastName}` : r.user.name || r.user),
        dates: r.startDate && r.endDate ? `${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}` : '',
        amount: r.price,
        status: r.status
      })));
      // Statistiques
      setStats({
        totalUsers: usersData.length,
        totalBoats: boatsData.length,
        totalReservations: reservationsData.length,
        totalRevenue: reservationsData.reduce((acc, r) => acc + (r.totalPrice || r.amount || 0), 0),
        pendingValidations: boatsData.filter(b => b.status === 'en_attente').length
      });
      // Avis (optionnel)
      try {
        // Agréger les reviews à partir des réservations existantes
        const allReviews = [];
        reservationsData.forEach(res => {
          if (res.review) {
            allReviews.push({
              id: res.review._id,
              boat: res.boat && (res.boat.name || res.boat),
              reviewer: res.review.user && (res.review.user.firstName ? `${res.review.user.firstName} ${res.review.user.lastName}` : res.review.user.name || res.review.user),
              rating: res.review.rating,
              comment: res.review.comment,
              date: res.review.createdAt || res.review.date
            });
          } else if (Array.isArray(res.reviews)) {
            res.reviews.forEach(rv => {
              allReviews.push({
                id: rv._id,
                boat: res.boat && (res.boat.name || res.boat),
                reviewer: rv.user && (rv.user.firstName ? `${rv.user.firstName} ${rv.user.lastName}` : rv.user.name || rv.user),
                rating: rv.rating,
                comment: rv.comment,
                date: rv.createdAt || rv.date
              });
            });
          }
        });
        setReviews(allReviews);
      } catch (err) {
        setReviews([]);
      }
    } catch (error) {
      // Gérer les erreurs (optionnel: afficher une notification)
      console.error('Erreur lors du chargement des données du dashboard :', error);
    }
  }

  useEffect(() => { fetchData(); }, []);

  // Handlers pour les actions utilisateur
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };
  const [editUser, setEditUser] = useState(null);
  const handleEditUser = (user) => {
    setEditUser(user);
  };

  // State pour modals bateau
  const [viewBoat, setViewBoat] = useState(null);
  const [editBoat, setEditBoat] = useState(null);

  // Handlers pour les actions bateau
  const handleViewBoat = (boat) => {
    setViewBoat(boat);
  };
  const handleEditBoat = (boat) => {
    // Chercher l'objet complet dans boats (issu de la BDD)
    const fullBoat = boats.find(b => b.id === boat.id || b._id === boat._id) || boat;
    setEditBoat(fullBoat);
  };
  const handleDeleteBoat = async (boat) => {
    if(window.confirm(`Supprimer le bateau ${boat.name} ?`)) {
      try {
        await boatService.deleteBoat(boat.id || boat._id);
        fetchData();
      } catch (err) {
        alert('Erreur lors de la suppression du bateau : ' + (err?.response?.data?.message || err?.message || 'inconnue'));
      }
    }
  };
  const handleSaveEditBoat = async (data) => {
    if (!editBoat) return;
    try {
      await boatService.updateBoat(editBoat.id || editBoat._id, data);
      setEditBoat(null);
      fetchData();
    } catch (err) {
      alert('Erreur lors de la modification : ' + (err?.response?.data?.message || err?.message || 'inconnue'));
    }
  };

  const handleSaveEditUser = async (data) => {
    if (!editUser) return;
    try {
      await userService.updateProfile(editUser.id || editUser._id, data);
      setEditUser(null);
      fetchData();
    } catch (err) {
      alert('Erreur lors de la modification : ' + (err?.message || 'inconnue'));
    }
  };
  const handleDeleteUser = async (user) => {
    if(window.confirm(`Supprimer l'utilisateur ${user.name} ?`)) {
      try {
        await userService.deleteUser(user.id || user._id);
        // Recharger la liste des utilisateurs
        fetchData();
      } catch (err) {
        alert('Erreur lors de la suppression : ' + (err?.message || 'inconnue'));
      }
    }
  };




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
          <div className="stat-icon">🏦</div>
          <div className="stat-info">
            <h3>{(stats.totalSiteRevenue || 0).toLocaleString()}€</h3>
            <p>Chiffre d'affaires du site (commission)</p>
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
        <div className="flex flex-col gap-4">
        {recentActivities.map((activity, idx) => (
          <div className="activity-item" key={idx}>
            <span className="activity-icon">{activity.icon}</span>
            <span>{activity.text}</span>
            <span className="activity-time">{activity.timeAgo}</span>
          </div>
        ))}
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
                    <button className="btn-icon" title="Voir" onClick={() => handleViewBoat(boat)}>👁️</button>
                    <button className="btn-icon" title="Modifier" onClick={() => handleEditBoat(boat)}>✏️</button>
                    <button className="btn-icon danger" title="Supprimer" onClick={() => handleDeleteBoat(boat)}>🗑️</button>
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
            {reservationsRaw.map(reservation => (
              <tr key={reservation._id}>
                <td>{reservation.boat?.name || reservation.boat}</td>
                <td>{reservation.user ? `${reservation.user.firstName || ''} ${reservation.user.lastName || ''}`.trim() : ''}</td>
                <td>{reservation.startDate && reservation.endDate ? `${new Date(reservation.startDate).toLocaleDateString()} - ${new Date(reservation.endDate).toLocaleDateString()}` : ''}</td>
                <td>{reservation.price}€</td>
                <td>
                  <span className={`status ${reservation.status}`}>{reservation.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Voir" onClick={() => setSelectedReservation(reservation)}>👁️</button>
                    <button className="btn-icon" title="Modifier" onClick={() => setEditReservation(reservation)}>✏️</button>
                    <button className="btn-icon danger" title="Supprimer" onClick={async () => {
                      if(window.confirm('Supprimer cette réservation ?')) {
                        try {
                          await reservationService.deleteReservation(reservation._id || reservation.id);
                          fetchData();
                        } catch (err) {
                          alert('Erreur lors de la suppression : ' + (err?.message || 'inconnue'));
                        }
                      }
                    }}>🗑️</button>
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
        {viewBoat && (
          <BoatViewModal
            boat={viewBoat}
            open={!!viewBoat}
            onClose={() => setViewBoat(null)}
          />
        )}
        {editBoat && (
          <BoatEditModal
            boat={editBoat}
            open={!!editBoat}
            onClose={() => setEditBoat(null)}
            onSave={handleSaveEditBoat}
          />
        )}
        {selectedReservation && (
          <ReservationDetailModal
            reservation={selectedReservation}
            onClose={() => setSelectedReservation(null)}
          />
        )}
        {editReservation && (
          <ReservationEditModal
            reservation={editReservation}
            open={!!editReservation}
            onClose={() => setEditReservation(null)}
            onSave={async (data) => {
              try {
                console.log('DEBUG editReservation:', editReservation);
                const reservationId = editReservation._id || editReservation.id;
                if (!reservationId) {
                  console.error('Aucun id de réservation trouvé !', editReservation);
                  alert('Erreur technique : id réservation introuvable.');
                  return;
                }
                await reservationService.updateReservation(reservationId, {
                  status: data.status,
                  startDate: data.startDate,
                  endDate: data.endDate,
                  price: data.price
                });
                setEditReservation(null);
                fetchData();
              } catch (err) {
                alert('Erreur lors de la modification : ' + (err?.message || 'inconnue'));
              }
            }}
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