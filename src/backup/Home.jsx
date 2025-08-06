import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import heroImage from '../assets/images/hero_sunset.jpg';
import logo from '../assets/images/logo.svg';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <img 
              src={logo} 
              alt="SailingLoc Logo" 
              style={{ height: '40px', marginRight: '10px' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                // Afficher un texte de remplacement si l'image ne charge pas
                e.target.parentNode.innerHTML += `<div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#4A6FA5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{
                    width: '24px',
                    height: '24px',
                    color: 'white'
                  }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18V12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 12L18 16L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12L6 16L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>`;
              }}
            />
            <span style={{
              color: '#4A6FA5',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>SAILING.LOC</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {currentUser ? (
              <Link 
                to={currentUser.role === 'owner' ? '/owner/dashboard' : '/dashboard'} 
                style={{
                  backgroundColor: '#4A6FA5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Mon espace
              </Link>
            ) : (
              <>
                <Link to="/login" style={{
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>
                  Connexion
                </Link>
                <Link to="/register" style={{
                  backgroundColor: '#4A6FA5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}>
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '80px 0',
        position: 'relative',
        minHeight: '500px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              Naviguez en toute liberté
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              maxWidth: '500px',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
            }}>
              Louez un bateau auprès de propriétaires particuliers et vivez une expérience nautique unique.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem'
            }}>
              <Link to="/register" style={{
                backgroundColor: '#FF6B6B',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                Commencer maintenant
              </Link>
              <a href="#how-it-works" style={{
                backgroundColor: 'white',
                color: '#4A6FA5',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                Comment ça marche ?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how-it-works" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat text-3xl text-dark text-center mb-12">Comment ça marche ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-montserrat text-xl font-semibold mb-4">Trouvez votre bateau</h3>
              <p className="text-gray-600">
                Parcourez notre sélection de bateaux disponibles à la location et choisissez celui qui correspond à vos besoins.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-montserrat text-xl font-semibold mb-4">Réservez en ligne</h3>
              <p className="text-gray-600">
                Sélectionnez vos dates et effectuez votre réservation en quelques clics. Paiement sécurisé et confirmation immédiate.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-montserrat text-xl font-semibold mb-4">Naviguez</h3>
              <p className="text-gray-600">
                Rencontrez le propriétaire, récupérez les clés et profitez de votre expérience nautique en toute sérénité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations populaires */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat text-3xl text-dark text-center mb-12">Destinations populaires</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {['Marseille', 'Cannes', 'La Rochelle', 'Saint-Tropez'].map((destination, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Image de {destination}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-montserrat text-lg font-semibold mb-2">{destination}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {Math.floor(Math.random() * 50) + 10} bateaux disponibles
                  </p>
                  <a href="#" className="text-secondary hover:text-primary text-sm font-medium">
                    Voir les bateaux →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat text-3xl text-dark text-center mb-12">Ce que disent nos clients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sophie Martin',
                role: 'Locataire',
                comment: 'Une expérience incroyable ! Le bateau était parfait et le propriétaire très accueillant. Je recommande vivement SailingLoc pour vos locations de bateaux.'
              },
              {
                name: 'Thomas Dubois',
                role: 'Propriétaire',
                comment: 'Grâce à SailingLoc, j\'ai pu rentabiliser mon bateau facilement. La plateforme est intuitive et l\'équipe très réactive. Un vrai plus pour les propriétaires !'
              },
              {
                name: 'Julie Moreau',
                role: 'Locataire',
                comment: 'Première expérience de location entre particuliers et je ne suis pas déçue ! Tout s\'est déroulé parfaitement du début à la fin. À refaire sans hésiter.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h3 className="font-montserrat font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pacifico text-3xl mb-6">Prêt à naviguer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté et commencez votre aventure nautique dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn-coral px-8 py-3">
              S'inscrire maintenant
            </Link>
            <Link to="/login" className="bg-white text-primary hover:bg-neutral px-8 py-3 rounded-md transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
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

export default Home;
