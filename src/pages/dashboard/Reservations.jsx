import { useState, useEffect } from 'react';
import ReservationDetailModal from '../../components/ReservationDetailModal';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import reservationService from '../../services/reservation.service';
import Layout from '../../Layout';

const Reservations = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [sortBy, setSortBy] = useState('date'); // date, boat, tenant, price

  useEffect(() => {
    // Chargement dynamique des réservations depuis l'API, déclenché à chaque fois que currentUser change
    if (!currentUser) return;
    const fetchReservations = async () => {
      try {
        let reservationsData = [];
        if (currentUser?.role === 'propriétaire') {
          reservationsData = await reservationService.getMyBoatsReservations();
        } else if (currentUser?.role === 'locataire') {
          reservationsData = await reservationService.getMyReservations();
        } else {
          // Rôle non supporté
          setReservations([]);
          console.warn('Rôle utilisateur inconnu ou non supporté pour l’affichage des réservations.');
          return;
        }
        setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchReservations();
  }, [currentUser]);

  const handleStatusChange = (reservationId, newStatus) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: newStatus }
          : reservation
      )
    );
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'boat':
        return a.boatName.localeCompare(b.boatName);
      case 'tenant':
        return a.tenantName.localeCompare(b.tenantName);
      case 'price':
        return b.totalPrice - a.totalPrice;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Main content - même arrière-plan et titre que OwnerDashboard */}
        <div className="bg-background min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <h1 className="font-pacifico text-primary text-3xl mb-8">Réservations</h1>

            {/* Filters and Controls */}
            <div className="card p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrer par statut
                    </label>
                    <select 
                      value={filter} 
                      onChange={(e) => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">Toutes</option>
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmées</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">{reservations.length}</p>
                    <p className="text-gray-600 text-sm">Total réservations</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">
                      {reservations.filter(r => r.status === 'pending').length}
                    </p>
                    <p className="text-gray-600 text-sm">En attente</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">
                      {reservations.filter(r => r.status === 'confirmed').length}
                    </p>
                    <p className="text-gray-600 text-sm">Confirmées</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-coral-light mr-4">
                    <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">
                      {reservations.reduce((sum, r) => r.status === 'confirmed' ? sum + (Number(r.totalPrice || r.price || 0)) : sum, 0)} €
                    </p>
                    <p className="text-gray-600 text-sm">Revenus confirmés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="card p-6">
              <h2 className="font-montserrat text-xl font-semibold text-dark mb-6">
                Liste des réservations ({sortedReservations.length})
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Chargement des réservations...</p>
                </div>
              ) : sortedReservations.filter(r => r.status !== 'cancelled').length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bateau
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Locataire
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedReservations.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reservation.boat?.name || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{reservation.user?.firstName} {reservation.user?.lastName}</div>
                              <div className="text-sm text-gray-500">{reservation.user?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000 * 60 * 60 * 24))} jours
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
    {reservation.totalPrice || reservation.price || (reservation.boat?.dailyPrice && reservation.startDate && reservation.endDate ?
      ((Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000*60*60*24))) * reservation.boat.dailyPrice) : '-')
    } €
  </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                              {getStatusText(reservation.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    <button
      className="text-blue-600 hover:text-blue-800 mr-2"
      onClick={() => setSelectedReservation(reservation)}
    >
      Détails
    </button>
    {reservation.status === 'pending' && (
      <>
        <button
          onClick={() => handleStatusChange(reservation.id, 'confirmed')}
          className="text-green-600 hover:text-green-800"
        >
          Accepter
        </button>
        <button
          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
          className="text-red-600 hover:text-red-800"
        >
          Refuser
        </button>
      </>
    )}
  </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bouton retour au dashboard */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/owner/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
        <ReservationDetailModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
      </div>
    </Layout>
  );
};

export default Reservations;
