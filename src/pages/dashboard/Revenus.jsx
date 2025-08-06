import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';

const Revenus = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, quarter, year
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    // Simuler le chargement des données de revenus depuis l'API
    const fetchRevenueData = async () => {
      try {
        const mockRevenueData = [
          {
            id: '1',
            month: 'Janvier 2025',
            boatName: 'Jeanneau Prestige 36',
            reservations: 3,
            totalRevenue: 4050,
            commission: 405,
            netRevenue: 3645,
            status: 'paid'
          },
          {
            id: '2',
            month: 'Février 2025',
            boatName: 'Jeanneau Prestige 36',
            reservations: 2,
            totalRevenue: 2700,
            commission: 270,
            netRevenue: 2430,
            status: 'paid'
          },
          {
            id: '3',
            month: 'Mars 2025',
            boatName: 'Bayliner R42',
            reservations: 4,
            totalRevenue: 11200,
            commission: 1120,
            netRevenue: 10080,
            status: 'paid'
          },
          {
            id: '4',
            month: 'Avril 2025',
            boatName: 'Jeanneau Prestige 36',
            reservations: 5,
            totalRevenue: 6750,
            commission: 675,
            netRevenue: 6075,
            status: 'pending'
          },
          {
            id: '5',
            month: 'Mai 2025',
            boatName: 'Bayliner R42',
            reservations: 6,
            totalRevenue: 16800,
            commission: 1680,
            netRevenue: 15120,
            status: 'pending'
          }
        ];
        
        setRevenueData(mockRevenueData);
      } catch (error) {
        console.error('Erreur lors du chargement des revenus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalCommission = revenueData.reduce((sum, item) => sum + item.commission, 0);
  const totalNetRevenue = revenueData.reduce((sum, item) => sum + item.netRevenue, 0);
  const paidRevenue = revenueData.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.netRevenue, 0);
  const pendingRevenue = revenueData.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.netRevenue, 0);

  const getStatusColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status) => {
    return status === 'paid' ? 'Payé' : 'En attente';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - identique à OwnerDashboard */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12">
              <img src={logoColor} alt="SailingLOC" className="h-full" />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-dark mr-4">Bonjour, {currentUser?.name || 'Céline'}</span>
            <button 
              onClick={handleLogout}
              className="bg-neutral hover:bg-gray-300 text-dark py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content - même arrière-plan et titre que OwnerDashboard */}
      <main className="bg-background min-h-screen">
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

              <div className="flex items-center gap-2">
                <button className="btn-primary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Exporter rapport
                </button>
                <button className="btn-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Graphiques
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">{totalRevenue.toLocaleString()} €</p>
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bateau
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réservations
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenus bruts
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenus nets
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueData.map((revenue) => (
                      <tr key={revenue.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{revenue.month}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{revenue.boatName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{revenue.reservations}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{revenue.totalRevenue.toLocaleString()} €</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-600">-{revenue.commission.toLocaleString()} €</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">{revenue.netRevenue.toLocaleString()} €</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(revenue.status)}`}>
                            {getStatusText(revenue.status)}
                          </span>
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
      </main>
      
      {/* Footer - identique à OwnerDashboard */}
      <footer className="bg-primary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">À PROPOS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">À propos</a></li>
                <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:underline">CGU</a></li>
                <li><a href="#" className="hover:underline">Mentions légales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">NOUS FAIRE CONFIANCE</h3>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <p>Note : 4.8 / 5 calculée à partir de 5 000 avis</p>
              <a href="#" className="text-coral hover:underline mt-2 inline-block">Avis de notre communauté</a>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <p className="mb-2">Besoin de conseils ?</p>
              <p className="mb-2">Nous sommes joignables :</p>
              <p className="mb-1">Du lundi au vendredi : 8h00 à 20h00</p>
              <p className="mb-2">Samedi et Dimanche : 10h00 à 18h00</p>
              <a href="mailto:contact@sailingloc.com" className="flex items-center text-coral hover:underline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@sailingloc.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Revenus;
