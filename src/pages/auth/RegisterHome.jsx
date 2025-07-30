import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faShip, faHome } from '@fortawesome/free-solid-svg-icons';
import './RegisterHome.css';

const RegisterHome = () => {
  const tenantCardRef = useRef(null);
  const ownerCardRef = useRef(null);

  // Fonction pour égaliser la hauteur des cartes
  const equalizeCardHeights = () => {
    if (tenantCardRef.current && ownerCardRef.current) {
      // Réinitialiser les hauteurs
      tenantCardRef.current.style.height = 'auto';
      ownerCardRef.current.style.height = 'auto';
      
      // Calculer la hauteur maximale
      const tenantHeight = tenantCardRef.current.offsetHeight;
      const ownerHeight = ownerCardRef.current.offsetHeight;
      const maxHeight = Math.max(tenantHeight, ownerHeight);
      
      // Appliquer la hauteur maximale aux deux cartes
      tenantCardRef.current.style.height = `${maxHeight}px`;
      ownerCardRef.current.style.height = `${maxHeight}px`;
    }
  };

  // Exécuter l'égalisation au chargement et au redimensionnement
  useEffect(() => {
    equalizeCardHeights();
    window.addEventListener('resize', equalizeCardHeights);
    
    return () => {
      window.removeEventListener('resize', equalizeCardHeights);
    };
  }, []);

  return (
    <div className="register-home-container">
      <Link to="/" className="back-to-home">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <div className="register-home-box">
        <div className="register-home-title">Rejoignez SailingLoc</div>
        <div className="register-home-subtitle">Choisissez votre profil</div>
        
        <div className="register-options">
          <Link to="/register/tenant" className="register-option-card" ref={tenantCardRef}>
            <div className="register-option-icon">
              <FontAwesomeIcon icon={faUserFriends} size="4x" className="register-icon" />
            </div>
            <div className="register-option-title">Locataire</div>
            <div className="register-option-description">
              Je souhaite louer un bateau pour mes vacances ou sorties en mer
            </div>
            <div className="register-option-button">S'inscrire comme locataire</div>
          </Link>
          
          <Link to="/register/owner" className="register-option-card" ref={ownerCardRef}>
            <div className="register-option-icon">
              <FontAwesomeIcon icon={faShip} size="4x" className="register-icon" />
            </div>
            <div className="register-option-title">Propriétaire</div>
            <div className="register-option-description">
              Je possède un bateau et souhaite le mettre en location
            </div>
            <div className="register-option-button">S'inscrire comme propriétaire</div>
          </Link>
        </div>
        
        <div className="login-redirect">
          <p>Déjà inscrit ? <Link to="/login">Connectez-vous</Link></p>
        </div>
        
        <div className="terms">
          <p>
            En vous inscrivant, vous acceptez nos{' '}
            <a href="#">Conditions d'utilisation</a>{' '}
            et notre{' '}
            <a href="#">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterHome;
