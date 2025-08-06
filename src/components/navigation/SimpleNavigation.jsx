import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const SimpleNavigation = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <img src="/logo-SailingLOC-couleur.png" alt="SAILING.LOC" className="h-10" />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-blue-800 hover:text-blue-600">Accueil</Link></li>
            <li><Link to="/boats/motor" className="text-blue-800 hover:text-blue-600">Bateaux à moteur</Link></li>
            <li><Link to="/boats/sailing" className="text-blue-800 hover:text-blue-600">Voiliers</Link></li>
            <li><Link to="/about" className="text-blue-800 hover:text-blue-600">À propos</Link></li>
            <li><Link to="/contact" className="text-blue-800 hover:text-blue-600">Contact</Link></li>
            <li><Link to="/login" className="text-blue-800 hover:text-blue-600"><FontAwesomeIcon icon={faUser} /></Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SimpleNavigation;
