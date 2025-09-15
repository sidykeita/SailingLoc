import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Revenus = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, quarter, year
  const [selectedYear, setSelectedYear] = useState('2025');

  // Helpers pour l'agrégation des revenus
  const getMonthLabel = (date) => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getQuarterLabel = (date) => {
    const q = Math.floor(date.getMonth() / 3) + 1;
    return `T${q} ${date.getFullYear()}`;
  };

  const groupReservations = (reservations, period, year) => {
    const byKey = {};
    (reservations || []).forEach((r) => {
      // sécurité champs
      const d = r.startDate ? new Date(r.startDate) : null;
      if (!d || isNaN(d)) return;
      if (d.getFullYear() !== parseInt(year, 10)) return;

      const boatName = r.boat?.name || r.boat?.title || r.boat?.model || 'Bateau';
      let label = getMonthLabel(d);
      if (period === 'quarter') label = getQuarterLabel(d);
      if (period === 'year') label = `${d.getFullYear()}`;

      const key = `${label}__${boatName}`;
      if (!byKey[key]) {
        byKey[key] = {
          id: key,
          month: label,
          boatName,
          reservations: 0,
          netRevenue: 0,
          status: 'pending', // valeur par défaut, remplacée ci-dessous par le statut réel
        };
      }
      byKey[key].reservations += 1;
      // Prix: utiliser le champ price; fallback si manquant (anciennes réservations)
      let price = typeof r.price === 'number' ? r.price : Number(r.price || 0);
      if (!price && r.startDate && r.endDate && r.boat?.dailyPrice) {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        const msPerDay = 24 * 60 * 60 * 1000;
        const days = Math.max(1, Math.ceil((end - start) / msPerDay));
        price = Number(r.boat.dailyPrice) * days;
      }
      // Calcul commission et net pour chaque réservation
      const commission = price * 0.10;
      const net = price - commission;
      byKey[key].commission = (byKey[key].commission || 0) + commission;
      byKey[key].netRevenue = (byKey[key].netRevenue || 0) + net; 
      // Statut: refléter la BDD (pending/confirmed/cancelled). On affiche paid uniquement si confirmed.
      const status = r.status || 'pending';
      byKey[key].status = status === 'confirmed' ? 'paid' : (status === 'cancelled' ? 'cancelled' : 'pending');
    });

    // Transforme en tableau trié par période
    return Object.values(byKey).sort((a, b) => a.month.localeCompare(b.month, 'fr'));
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/reservations/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reservations = Array.isArray(res.data) ? res.data : [];
        const aggregated = groupReservations(reservations, selectedPeriod, selectedYear);
        setRevenueData(aggregated);
      } catch (error) {
        console.error('Erreur lors du chargement des revenus:', error);
        setRevenueData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedPeriod, selectedYear]);

  // Déconnexion gérée par HeaderDashboard

  // Montant brut, commission, net
  const confirmedRevenueData = revenueData.filter(item => item.status === 'paid');
  const totalGrossRevenue = confirmedRevenueData.reduce((sum, item) => sum + item.netRevenue + (item.commission || 0), 0);
  const totalCommission = confirmedRevenueData.reduce((sum, item) => sum + (item.commission || 0), 0);
  const totalNetRevenue = confirmedRevenueData.reduce((sum, item) => sum + item.netRevenue, 0);
  const paidRevenue = revenueData.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.netRevenue, 0);
  const pendingRevenue = revenueData.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.netRevenue, 0);

  const getStatusColor = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800'; // pending
  };

  const getStatusText = (status) => {
    if (status === 'paid') return 'Payé';
    if (status === 'cancelled') return 'Annulé';
    return 'En attente';
  };

  return (
    <Layout>
        <div className="min-h-screen bg-background">
        {/* Main content - même arrière-plan et titre que OwnerDashboard */}
        <div className="bg-background min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <h1 className="font-pacifico text-primary text-3xl mb-8">Revenus</h1>

            {/* Period Selection */}
            <div className="card p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Période
                    </label>
                    <select 
                      value={selectedPeriod} 
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="month">Mensuel</option>
                      <option value="quarter">Trimestriel</option>
                      <option value="year">Annuel</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année
                    </label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">{totalGrossRevenue.toLocaleString()} €</p>
                  <p className="text-gray-600 text-sm">Revenus bruts</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-coral-light mr-4">
                  <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">{totalNetRevenue.toLocaleString()} €</p>
                  <p className="text-gray-600 text-sm">Revenus nets</p>
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
                  <p className="text-2xl font-bold text-dark">{paidRevenue.toLocaleString()} €</p>
                  <p className="text-gray-600 text-sm">Revenus payés</p>
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
                  <p className="text-2xl font-bold text-dark">{pendingRevenue.toLocaleString()} €</p>
                  <p className="text-gray-600 text-sm">En attente</p>
                </div>
              </div>
            </div>
          </div>

            {/* Revenue Details Table */}
            <div className="card p-6">
              <h2 className="font-montserrat text-xl font-semibold text-dark mb-6">
                Détail des revenus ({revenueData.length})
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Chargement des revenus...</p>
                </div>
              ) : revenueData.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-gray-500">Aucun revenu trouvé pour cette période</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bateau</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Réservations</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Montant brut</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu net</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {revenueData.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.boatName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">{item.reservations}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center font-semibold">{(item.netRevenue + (item.commission || 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-red-600 font-bold">{(item.commission || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-green-700 font-bold">{item.netRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</span>
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
      </div>
    </Layout>
  );
};

export default Revenus;
