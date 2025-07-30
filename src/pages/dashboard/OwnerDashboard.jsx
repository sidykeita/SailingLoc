import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';

const OwnerDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [boats, setBoats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des bateaux et réservations depuis l'API
    const fetchOwnerData = async () => {
      try {
        // Dans une application réelle, vous feriez des appels API ici
        // const boatsResponse = await axios.get('https://api.sailingloc.com/owner/boats');
        // const reservationsResponse = await axios.get('https://api.sailingloc.com/owner/reservations');
        
        // Pour le développement, nous simulons des données
        const mockBoats = [
          {
            id: '1',
            name: 'Jeanneau Prestige 36',
            type: 'Voilier',
            location: 'Marseille',
            length: 36,
            capacity: 8,
            pricePerDay: 450,
            status: 'available',
            imageUrl: 'https://example.com/boat1.jpg'
          },
          {
            id: '2',
            name: 'Bayliner R42',
            type: 'Moteur',
            location: 'Cannes',
            length: 42,
            capacity: 12,
            pricePerDay: 700,
            status: 'rented',
            imageUrl: 'https://example.com/boat2.jpg'
          }
        ];
        
        const mockReservations = [
          {
            id: '1',
            boatId: '1',
            boatName: 'Jeanneau Prestige 36',
            tenantName: 'Sophie Martin',
            startDate: '2025-07-15',
            endDate: '2025-07-18',
            status: 'confirmed',
            totalPrice: 1350
          },
          {
            id: '2',
            boatId: '2',
            boatName: 'Bayliner R42',
            tenantName: 'Thomas Dubois',
            startDate: '2025-08-05',
            endDate: '2025-08-10',
            status: 'pending',
            totalPrice: 2800
          }
        ];
        
        setBoats(mockBoats);
        setReservations(mockReservations);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  const handleLogout = () => {
    logout();
    // La redirection sera gérée par le ProtectedRoute
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12">
              <img src={logoColor} alt="SailingLOC" className="h-full" />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-dark mr-4">Bonjour, {currentUser?.name || 'Propriétaire'}</span>
            <button 
              onClick={handleLogout}
              className="bg-neutral hover:bg-gray-300 text-dark py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-8">Tableau de bord propriétaire</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil propriétaire */}
          <div className="card p-6 md:col-span-1">
            <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Mon profil</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Nom</p>
                <p className="font-medium">{currentUser?.name || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{currentUser?.email || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Rôle</p>
                <p className="font-medium">Propriétaire</p>
              </div>
              <button className="btn-secondary mt-4">Modifier mon profil</button>
            </div>
            
            {/* Résumé */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-montserrat text-lg font-semibold text-dark mb-4">Résumé</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Bateaux</p>
                  <p className="font-semibold text-xl">{boats.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Réservations</p>
                  <p className="font-semibold text-xl">{reservations.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">En attente</p>
                  <p className="font-semibold text-xl">
                    {reservations.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Confirmées</p>
                  <p className="font-semibold text-xl">
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mes bateaux */}
          <div className="card p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-montserrat text-xl font-semibold text-dark">Mes bateaux</h2>
              <button className="btn-primary">Ajouter un bateau</button>
            </div>
            
            {loading ? (
              <p className="text-center py-4">Chargement des bateaux...</p>
            ) : boats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore de bateau enregistré</p>
                <button className="btn-primary">Ajouter mon premier bateau</button>
              </div>
            ) : (
              <div className="space-y-4">
                {boats.map((boat) => (
                  <div key={boat.id} className="border rounded-lg p-4 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 bg-neutral rounded-lg h-32 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
                      <span className="text-gray-500">Image du bateau</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-montserrat font-semibold text-lg">{boat.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          boat.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {boat.status === 'available' ? 'Disponible' : 'En location'}
                        </span>
                      </div>
                      <p className="text-gray-600">{boat.location}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div>
                          <p className="text-gray-500 text-sm">Type</p>
                          <p>{boat.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Longueur</p>
                          <p>{boat.length} pieds</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Capacité</p>
                          <p>{boat.capacity} personnes</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Prix/jour</p>
                          <p className="font-semibold">{boat.pricePerDay} €</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="btn-secondary py-2 px-4">Modifier</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Demandes de réservation */}
        <div className="card p-6 mt-8">
          <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Demandes de réservation</h2>
          
          {loading ? (
            <p className="text-center py-4">Chargement des réservations...</p>
          ) : reservations.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Aucune demande de réservation pour le moment</p>
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
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.boatName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reservation.tenantName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.totalPrice} €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-secondary hover:text-primary">
                            Détails
                          </button>
                          {reservation.status === 'pending' && (
                            <>
                              <button className="text-green-600 hover:text-green-800">
                                Accepter
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                Refuser
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Actions rapides */}
        <div className="mt-8">
          <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="font-medium">Ajouter un bateau</span>
            </button>
            
            <button className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-medium">Calendrier</span>
            </button>
            
            <button className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="font-medium">Réservations</span>
            </button>
            
            <button className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Revenus</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
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

export default OwnerDashboard;
