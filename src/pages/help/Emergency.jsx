import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLifeRing, faPhone, faAmbulance, faWrench, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Emergency() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Link to="/help" style={{ color: '#274991', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Retour à l'aide
          </Link>
        </div>

        <h1 style={{ color: '#274991', marginBottom: '20px' }}>Assistance d'urgence</h1>
        
        <div style={{ marginBottom: '30px', backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
          <h2 style={{ color: '#721c24', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: '10px' }} />
            Numéro d'urgence SailingLoc
          </h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#721c24' }}>+33 (0)1 23 45 67 89</p>
          <p style={{ marginTop: '10px' }}>Disponible 24h/24 et 7j/7 pour toute urgence pendant votre location</p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faAmbulance} style={{ marginRight: '10px' }} />
            Numéros d'urgence nationaux
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>SAMU</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>15</p>
              <p>Urgences médicales</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Police / Gendarmerie</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>17</p>
              <p>Urgences sécuritaires</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Pompiers</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>18</p>
              <p>Incendies, accidents et secours</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Urgence Européenne</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>112</p>
              <p>Numéro d'urgence unique européen</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>CROSS</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>196</p>
              <p>Secours en mer (depuis un téléphone)</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>CROSS VHF</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Canal 16</p>
              <p>Secours en mer (depuis une VHF)</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faWrench} style={{ marginRight: '10px' }} />
            Problèmes techniques
          </h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Panne moteur</h3>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Vérifiez le niveau de carburant</li>
              <li style={{ marginBottom: '10px' }}>Assurez-vous que la batterie est correctement connectée</li>
              <li style={{ marginBottom: '10px' }}>Vérifiez que le coupe-circuit est bien enclenché</li>
              <li style={{ marginBottom: '10px' }}>Si le problème persiste, contactez notre assistance technique au +33 (0)1 23 45 67 90</li>
            </ol>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Problèmes électriques</h3>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Vérifiez le tableau électrique et les fusibles</li>
              <li style={{ marginBottom: '10px' }}>Assurez-vous que les batteries sont chargées</li>
              <li style={{ marginBottom: '10px' }}>Si nécessaire, utilisez le groupe électrogène de secours (si équipé)</li>
              <li style={{ marginBottom: '10px' }}>En cas de problème persistant, contactez notre assistance technique</li>
            </ol>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Voie d'eau</h3>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px', fontWeight: 'bold', color: '#721c24' }}>Activez immédiatement les pompes de cale</li>
              <li style={{ marginBottom: '10px', fontWeight: 'bold', color: '#721c24' }}>Localisez la source de l'infiltration d'eau</li>
              <li style={{ marginBottom: '10px', fontWeight: 'bold', color: '#721c24' }}>Utilisez les équipements d'urgence (bouchons, colmatage)</li>
              <li style={{ marginBottom: '10px', fontWeight: 'bold', color: '#721c24' }}>Si la situation est grave, contactez immédiatement le CROSS (196 ou canal 16 VHF)</li>
              <li style={{ marginBottom: '10px' }}>Informez SailingLoc de la situation dès que possible</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faLifeRing} style={{ marginRight: '10px' }} />
            Procédures d'urgence en mer
          </h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Homme à la mer</h3>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Criez "HOMME À LA MER" et notez la position GPS</li>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Lancez immédiatement une bouée couronne</li>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Désignez une personne pour garder un contact visuel permanent avec la personne à l'eau</li>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Manœuvrez le bateau pour revenir vers la personne</li>
              <li style={{ marginBottom: '5px' }}>Lancez un appel de détresse si nécessaire (MAYDAY sur canal 16 VHF ou 196)</li>
            </ol>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Incendie à bord</h3>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Coupez l'alimentation en carburant et l'électricité</li>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Utilisez l'extincteur adapté au type de feu</li>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Fermez les écoutilles pour limiter l'apport d'oxygène</li>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Si le feu ne peut être maîtrisé, préparez-vous à évacuer</li>
              <li style={{ marginBottom: '5px' }}>Lancez un appel de détresse (MAYDAY sur canal 16 VHF ou 196)</li>
            </ol>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Conditions météorologiques extrêmes</h3>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Réduisez la voilure ou la vitesse</li>
              <li style={{ marginBottom: '5px' }}>Assurez-vous que tous les passagers portent leur gilet de sauvetage</li>
              <li style={{ marginBottom: '5px' }}>Fermez toutes les ouvertures (hublots, panneaux)</li>
              <li style={{ marginBottom: '5px' }}>Cherchez un abri ou un port sûr si possible</li>
              <li style={{ marginBottom: '5px' }}>Restez en contact avec les autorités maritimes</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            Équipements de sécurité
          </h2>
          <p style={{ marginBottom: '20px' }}>Tous nos bateaux sont équipés du matériel de sécurité obligatoire :</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Équipements individuels</h3>
              <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>Gilets de sauvetage</li>
                <li>Harnais de sécurité</li>
                <li>Combinaisons de survie</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Équipements collectifs</h3>
              <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>Radeaux de survie</li>
                <li>Bouées couronne</li>
                <li>Feux à main</li>
                <li>Fusées de détresse</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Communication</h3>
              <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>VHF</li>
                <li>Balise de détresse</li>
                <li>Téléphone satellite (sur certains modèles)</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/help" style={{ 
            backgroundColor: '#274991', 
            color: 'white', 
            padding: '12px 25px', 
            borderRadius: '4px', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Retour à la page d'aide
          </Link>
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
  );
}

export default Emergency;
