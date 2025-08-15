import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSearch, faLifeRing, faShip, faCreditCard, faUserShield, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

function Help() {
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqItems, setFilteredFaqItems] = useState([]);
  const [highlightResults, setHighlightResults] = useState(false);

  const toggleQuestion = (questionId) => {
    console.log('Toggle question clicked:', questionId);
    setActiveQuestionId(activeQuestionId === questionId ? null : questionId);
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Faire défiler jusqu'aux résultats de recherche
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Mettre en évidence visuellement les résultats
    setHighlightResults(true);
    setTimeout(() => setHighlightResults(false), 1500);
  };

  const faqItems = [
    {
      id: 1,
      question: "Comment réserver un bateau ?",
      answer: "1. Recherchez un bateau selon vos critères\n2. Consultez les détails et disponibilités\n3. Sélectionnez vos dates\n4. Procédez au paiement sécurisé\n5. Recevez votre confirmation par email"
    },
    {
      id: 2,
      question: "Quelles sont les conditions de location ?",
      answer: "- Être âgé d'au moins 18 ans\n- Posséder un permis bateau valide\n- Présenter une pièce d'identité valide\n- Effectuer le paiement et la caution"
    },
    {
      id: 3,
      question: "Comment fonctionne la caution ?",
      answer: "La caution est bloquée sur votre carte bancaire avant la location. Elle est libérée intégralement après restitution du bateau en bon état."
    },
    {
      id: 4,
      question: "Que faire en cas d'annulation ?",
      answer: "Conditions d'annulation :\n- Plus de 7 jours avant : remboursement intégral\n- Entre 3 et 7 jours : remboursement partiel\n- Moins de 3 jours : aucun remboursement"
    },
    {
      id: 5,
      question: "Comment contacter le propriétaire ?",
      answer: "Après réservation, vous recevez les coordonnées du propriétaire. Vous pouvez aussi utiliser notre messagerie interne."
    },
    {
      id: 6,
      question: "Que comprend la location ?",
      answer: "Inclus : bateau, équipement de sécurité, gilets, navigation de base\nNon inclus : carburant, skipper, provisions"
    },
    {
      id: 7,
      question: "Puis-je modifier ma réservation ?",
      answer: "Modifications possibles selon disponibilité. Contactez-nous rapidement. Des frais peuvent s'appliquer."
    },
    {
      id: 8,
      question: "Aide en urgence ?",
      answer: "En urgence en mer :\n- CROSS : 196\n- VHF canal 16\n- Notre assistance 24h/24"
    }
  ];
  
  // Filtrer les questions FAQ en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaqItems(faqItems);
    } else {
      const filtered = faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqItems(filtered);
      
      // Si la recherche a des résultats et qu'on tape dans le champ, faire défiler automatiquement
      if (filtered.length > 0 && document.activeElement.tagName === 'INPUT') {
        const faqSection = document.getElementById('faq-section');
        if (faqSection) {
          setTimeout(() => {
            faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }
  }, [searchQuery]);

  return (
    <div style={{ padding: '20px', paddingTop: '100px', width: '100%', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="help-container" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h1 style={{ 
            color: '#274991', 
            marginBottom: '20px', 
            textAlign: 'center',
            position: 'relative',
            paddingBottom: '15px'
          }}>
            Centre d'aide SailingLoc
            <span style={{
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '3px',
              backgroundColor: '#66C7C7',
              display: 'block'
            }}></span>
          </h1>
          
          <div style={{ marginBottom: '20px' }}>
            <Link to="/" style={{ color: '#274991', textDecoration: 'none' }}>
              &larr; Retour à l'accueil
            </Link>
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearchSubmit} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            marginBottom: '30px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: '#274991', marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Rechercher dans l'aide..." 
              value={searchQuery}
              onChange={handleSearch}
              style={{ 
                flex: 1, 
                border: 'none', 
                padding: '10px', 
                borderRadius: '4px',
                backgroundColor: 'white'
              }} 
            />
            <button 
              type="submit"
              style={{ 
                backgroundColor: '#274991', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '4px',
                cursor: 'pointer'
            }}>
              Rechercher
            </button>
          </form>

          {/* Catégories d'aide */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
            {[
              { icon: faShip, title: "Location de bateaux", link: "/help/boat-rental" },
              { icon: faCreditCard, title: "Paiements et remboursements", link: "/help/payments" },
              { icon: faUserShield, title: "Compte et sécurité", link: "/help/account" },
              { icon: faLifeRing, title: "Assistance d'urgence", link: "/help/emergency" },
              { icon: faQuestionCircle, title: "Questions fréquentes", link: "/help/faq" }
            ].map((category, index) => (
              <Link key={index} to={category.link} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  flex: '1 1 calc(33.333% - 20px)', 
                  minWidth: '250px',
                  backgroundColor: '#f9f9f9', 
                  padding: '20px', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}>
                  <FontAwesomeIcon icon={category.icon} style={{ fontSize: '2rem', color: '#274991', marginBottom: '15px' }} />
                  <h3 style={{ color: '#274991', marginBottom: '10px' }}>{category.title}</h3>
                  <p style={{ color: '#666' }}>Cliquez pour en savoir plus</p>
                </div>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <div id="faq-section" style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#274991', 
              marginBottom: '20px',
              position: 'relative',
              paddingBottom: '15px',
              textAlign: 'center'
            }}>
              Questions fréquemment posées
              <span style={{
                content: '""',
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                backgroundColor: '#66C7C7',
                display: 'block'
              }}></span>
            </h2>
            
            {searchQuery.trim() !== '' && (
              <div style={{ 
                padding: '10px 15px', 
                backgroundColor: '#e6f7f7', 
                borderRadius: '4px', 
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <p style={{ margin: 0 }}>
                  <strong>{filteredFaqItems.length}</strong> résultat(s) trouvé(s) pour "{searchQuery}"
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#274991',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Effacer
                  </button>
                )}
              </div>
            )}
            
            {filteredFaqItems.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
                <p>Aucun résultat ne correspond à votre recherche. Essayez avec d'autres termes.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredFaqItems.map((item, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: highlightResults ? '0 0 15px rgba(102, 199, 199, 0.8)' : 'none',
                    transition: 'box-shadow 0.3s ease'
                  }}>
                    <div 
                      onClick={() => {
                        console.log('Clicking on FAQ item', item.id);
                        toggleQuestion(item.id);
                      }}
                      style={{ 
                        padding: '15px 20px',
                        backgroundColor: activeQuestionId === item.id ? '#274991' : '#f5f5f5',
                        color: activeQuestionId === item.id ? 'white' : '#333',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{item.question}</h3>
                      <FontAwesomeIcon icon={activeQuestionId === item.id ? faChevronUp : faChevronDown} />
                    </div>
                    
                    {activeQuestionId === item.id && (
                      <div style={{ 
                        padding: '20px',
                        backgroundColor: 'white',
                        whiteSpace: 'pre-line'
                      }}>
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '30px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#274991', marginBottom: '15px' }}>Besoin d'aide supplémentaire ?</h2>
            <p style={{ marginBottom: '20px' }}>Notre équipe de support est disponible 7j/7 pour répondre à vos questions.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  backgroundColor: '#274991', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 25px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Contacter le support
                </button>
              </Link>
              <a href="mailto:support@sailingloc.com" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  backgroundColor: 'white', 
                  color: '#274991', 
                  border: '1px solid #274991', 
                  padding: '12px 25px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Envoyer un email
                </button>
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', textAlign: 'center', marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          <div style={{ marginTop: '10px' }}>
            <Link to="/" style={{ color: '#274991', margin: '0 10px' }}>Accueil</Link>
            <Link to="/legal-notices" style={{ color: '#274991', margin: '0 10px' }}>Mentions légales</Link>
            <Link to="/cgu-cgv" style={{ color: '#274991', margin: '0 10px' }}>CGU / CGV</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
