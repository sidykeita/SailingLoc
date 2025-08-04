import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/DashboardBackground.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(14);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

  // Notifications simulées
  const notifications = [
    {
      id: 1,
      message: "Confirmez votre email et votre numéro de téléphone pour compléter votre profil",
      date: formattedDate
    },
    {
      id: 2,
      message: "Renseignez votre date d'anniversaire pour recevoir un coupon de réduction !",
      date: formattedDate
    },
    {
      id: 3,
      message: "Bienvenue sur Samboat",
      date: formattedDate
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <ul className="flex space-x-8">
            <li className="font-semibold text-teal-800 border-b-2 border-teal-800">
              <Link to="/dashboard">Tableau de bord</Link>
            </li>
            <li className="text-gray-600 hover:text-teal-800">
              <Link to="/locations">Mes locations</Link>
            </li>
            <li className="text-gray-600 hover:text-teal-800">
              <Link to="/bateaux">Mes bateaux</Link>
            </li>
            <li className="text-gray-600 hover:text-teal-800">
              <Link to="/compte">Mon compte</Link>
            </li>
            <li className="text-gray-600 hover:text-teal-800">
              <Link to="/avis">Mes avis</Link>
            </li>
            <li className="text-gray-600 hover:text-teal-800">
              <Link to="/favoris">Mes favoris</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil utilisateur */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-teal-800 flex items-center justify-center text-white text-5xl font-light mb-4">
                {currentUser ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase() : ''}
              </div>
              <button className="text-teal-400 text-sm mb-2">+ Ajouter une photo</button>
              <h2 className="text-2xl font-medium text-gray-800 mb-1">{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}</h2>
              <p className="text-gray-500 text-sm mb-4">Membre depuis 2025</p>
              
              <div className="w-full mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Profil complété à</span>
                  <span className="text-teal-400">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                </div>
              </div>
              
              <button className="w-full bg-teal-400 text-white py-2 rounded-md hover:bg-teal-500 transition-colors mb-3">
                Compléter mon profil
              </button>
              
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors mb-6">
                Voir mon profil
              </button>
              
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>Adresse email à</span>
                    <span className="text-teal-600 ml-1">valider</span>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>Numéro de téléphone à</span>
                    <span className="text-teal-600 ml-1">vérifier</span>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                    </svg>
                    <span>Carte d'identité à</span>
                    <span className="text-teal-600 ml-1">vérifier</span>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>CV Nautique à</span>
                    <span className="text-teal-600 ml-1">compléter</span>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                    </svg>
                    <span>Permis bateau à</span>
                    <span className="text-teal-600 ml-1">envoyer</span>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-800">Notifications</h2>
                <button className="text-teal-600 text-sm">Tout marquer comme lu</button>
              </div>
              
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="flex">
                    <div className="mr-3 mt-1">
                      <div className="w-4 h-4 rounded-full bg-teal-800 flex items-center justify-center text-white text-xs">
                        i
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-gray-500 text-sm">{notification.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Messages */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Mes derniers messages</h2>
              <p className="text-gray-600">Vous n'avez pas de messages pour le moment</p>
            </div>
            
            {/* Locations à venir */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Locations à venir</h2>
              <p className="text-gray-600">Aucune location à venir pour le moment</p>
            </div>
            
            {/* Annonces */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Annonces</h2>
              <button className="w-full border border-gray-300 rounded-md py-3 text-center text-teal-600 hover:bg-gray-50 transition-colors">
                + Ajouter une annonce.
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Aide flottante */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-teal-500 text-white rounded-full p-3 shadow-lg hover:bg-teal-600 transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Besoin d'aide ?
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
