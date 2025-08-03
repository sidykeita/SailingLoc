import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function Contact() {
  // État pour gérer le formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // État pour gérer la soumission du formulaire
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pourriez ajouter la logique pour envoyer les données à un backend
    console.log('Formulaire soumis:', formData);
    // Réinitialiser le formulaire et afficher un message de confirmation
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setIsSubmitted(true);
    
    // Réinitialiser le message de confirmation après 5 secondes
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div style={{ padding: '20px', paddingTop: '100px', width: '100%', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <Link to="/help" style={{ color: '#274991', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
              Retour à l'aide
            </Link>
          </div>

          <h1 style={{ color: '#274991', marginBottom: '20px' }}>Contactez-nous</h1>
        
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
              Vous avez des questions ou besoin d'assistance ? N'hésitez pas à nous contacter. Notre équipe est là pour vous aider.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
            {/* Formulaire de contact */}
            <div style={{ flex: '1 1 600px' }}>
              <h2 style={{ color: '#274991', marginBottom: '20px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
                Envoyez-nous un message
              </h2>
              
              {isSubmitted && (
                <div style={{ 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  padding: '15px', 
                  borderRadius: '5px', 
                  marginBottom: '20px' 
                }}>
                  Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#274991' }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#274991' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="subject" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#274991' }}>
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="message" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#274991' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  style={{ 
                    backgroundColor: '#274991', 
                    color: 'white', 
                    padding: '12px 25px', 
                    borderRadius: '5px', 
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '10px' }} />
                  Envoyer le message
                </button>
              </form>
            </div>
            
            {/* Informations de contact */}
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ color: '#274991', marginBottom: '20px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
                Nos coordonnées
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#274991', fontSize: '1.5rem', marginRight: '15px', marginTop: '3px' }} />
                <div>
                  <h3 style={{ color: '#274991', marginBottom: '5px' }}>Adresse</h3>
                  <p style={{ lineHeight: '1.6' }}>
                    SailingLoc<br />
                    123 Avenue de la Mer<br />
                    06400 Cannes<br />
                    France
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                <FontAwesomeIcon icon={faPhone} style={{ color: '#274991', fontSize: '1.5rem', marginRight: '15px', marginTop: '3px' }} />
                <div>
                  <h3 style={{ color: '#274991', marginBottom: '5px' }}>Téléphone</h3>
                  <p style={{ lineHeight: '1.6' }}>
                    Service client: +33 (0)1 23 45 67 89<br />
                    Assistance technique: +33 (0)1 23 45 67 90<br />
                    Urgences (24/7): +33 (0)1 23 45 67 91
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: '#274991', fontSize: '1.5rem', marginRight: '15px', marginTop: '3px' }} />
                <div>
                  <h3 style={{ color: '#274991', marginBottom: '5px' }}>Email</h3>
                  <p style={{ lineHeight: '1.6' }}>
                    Information: info@sailingloc.com<br />
                    Réservations: booking@sailingloc.com<br />
                    Support: support@sailingloc.com
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Heures d'ouverture</h3>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.6' }}>
                <li style={{ marginBottom: '5px' }}><strong>Lundi - Vendredi:</strong> 9h00 - 18h00</li>
                <li style={{ marginBottom: '5px' }}><strong>Samedi:</strong> 10h00 - 17h00</li>
                <li><strong>Dimanche:</strong> Fermé</li>
              </ul>
              <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
                Notre assistance téléphonique d'urgence est disponible 24h/24 et 7j/7.
              </p>
            </div>
          </div>
          
          {/* Carte Google Maps */}
          <div style={{ 
            height: '400px', 
            borderRadius: '8px', 
            overflow: 'hidden',
            marginBottom: '30px',
            border: '1px solid #ddd'
          }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2763.6875532115474!2d-1.1678193235421518!3d46.14400787200445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48014eea9a8d6d0f%3A0x7bb956357bb1b5a8!2sPort%20de%20Plaisance%2C%20Quai%20des%20Minimes%2C%2017000%20La%20Rochelle!5e0!3m2!1sfr!2sfr!4v1690756162443!5m2!1sfr!2sfr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Port de Plaisance, La Rochelle"
            ></iframe>
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

export default Contact;
