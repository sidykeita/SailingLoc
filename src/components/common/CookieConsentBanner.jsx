import React from 'react';
import { Link } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie } from '@fortawesome/free-solid-svg-icons';

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="J'accepte"
      declineButtonText="Je refuse"
      cookieName="sailingLocCookieConsent"
      style={{ 
        background: '#2B373B',
        padding: '15px',
        alignItems: 'center',
        fontSize: '14px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}
      buttonStyle={{
        background: '#4CAF50',
        color: '#fff',
        fontSize: '14px',
        padding: '8px 16px',
        borderRadius: '4px',
        margin: '0 10px'
      }}
      declineButtonStyle={{
        background: '#f44336',
        color: '#fff',
        fontSize: '14px',
        padding: '8px 16px',
        borderRadius: '4px',
        margin: '0 10px'
      }}
      enableDeclineButton
      expires={365}
      overlay
    >
      <div className="flex items-center">
        <FontAwesomeIcon 
          icon={faCookie} 
          className="mr-3 text-yellow-400"
          size="lg"
        />
        <span>
          Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
          En continuant, vous acceptez notre 
          <Link to="/politique-cookies" className="text-blue-300 hover:underline ml-1">
            politique de cookies
          </Link>.
        </span>
      </div>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
