import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faChevronDown, faChevronUp, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function FAQ() {
  // État pour gérer l'ouverture/fermeture des questions
  const [openQuestions, setOpenQuestions] = useState({});

  // Fonction pour basculer l'état d'une question
  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Liste des questions fréquentes par catégorie
  const faqCategories = [
    {
      title: "Réservation et location",
      questions: [
        {
          id: "q1",
          question: "Comment réserver un bateau sur SailingLoc ?",
          answer: "Pour réserver un bateau, recherchez d'abord le bateau qui vous convient à l'aide de notre moteur de recherche. Une fois que vous avez trouvé le bateau idéal, sélectionnez vos dates de location, remplissez le formulaire de réservation et procédez au paiement. Vous recevrez ensuite une confirmation de réservation par e-mail."
        },
        {
          id: "q2",
          question: "Quels documents dois-je fournir pour louer un bateau ?",
          answer: "Pour louer un bateau, vous devez fournir une pièce d'identité valide (carte d'identité ou passeport), un permis bateau valide pour les bateaux qui le nécessitent, et une carte bancaire pour la caution. Certains propriétaires peuvent demander des documents supplémentaires."
        },
        {
          id: "q3",
          question: "Puis-je annuler ma réservation ?",
          answer: "Oui, vous pouvez annuler votre réservation selon les conditions d'annulation spécifiées par le propriétaire. Ces conditions sont clairement indiquées sur la page de chaque bateau avant la réservation. En général, plus l'annulation est proche de la date de location, moins le remboursement sera important."
        }
      ]
    },
    {
      title: "Bateaux et équipements",
      questions: [
        {
          id: "q4",
          question: "Les bateaux sont-ils assurés ?",
          answer: "Oui, tous les bateaux proposés sur SailingLoc sont assurés avec une couverture de base. Cependant, nous vous recommandons de souscrire à une assurance complémentaire pour une protection optimale pendant votre location."
        },
        {
          id: "q5",
          question: "Que faire en cas de panne pendant ma location ?",
          answer: "En cas de panne, contactez immédiatement notre service d'assistance au +33 (0)1 23 45 67 89, disponible 24h/24 et 7j/7. Notre équipe technique vous guidera pour résoudre le problème ou organisera une intervention si nécessaire."
        },
        {
          id: "q6",
          question: "Les équipements de sécurité sont-ils fournis ?",
          answer: "Oui, tous nos bateaux sont équipés du matériel de sécurité obligatoire conformément à la réglementation en vigueur : gilets de sauvetage, extincteurs, fusées de détresse, etc. La liste complète des équipements est disponible sur la page de détail de chaque bateau."
        }
      ]
    },
    {
      title: "Paiements et tarifs",
      questions: [
        {
          id: "q7",
          question: "Comment fonctionne le système de caution ?",
          answer: "Une caution est demandée avant la prise en charge du bateau, généralement par pré-autorisation sur votre carte bancaire. Cette caution est restituée à la fin de la location si le bateau est rendu dans le même état qu'à la prise en charge, sans dommages."
        },
        {
          id: "q8",
          question: "Le carburant est-il inclus dans le prix ?",
          answer: "Non, le carburant n'est généralement pas inclus dans le prix de la location. Le bateau est fourni avec un réservoir plein et doit être rendu avec un réservoir plein. Si ce n'est pas le cas, le carburant manquant vous sera facturé."
        },
        {
          id: "q9",
          question: "Quels sont les moyens de paiement acceptés ?",
          answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les portefeuilles électroniques (PayPal, Apple Pay, Google Pay) et les virements bancaires pour les réservations à long terme."
        }
      ]
    },
    {
      title: "Compte et profil",
      questions: [
        {
          id: "q10",
          question: "Comment modifier mes informations personnelles ?",
          answer: "Pour modifier vos informations personnelles, connectez-vous à votre compte, cliquez sur votre nom d'utilisateur en haut à droite, puis sélectionnez 'Mon profil'. Vous pourrez alors modifier vos informations en cliquant sur le bouton 'Modifier'."
        },
        {
          id: "q11",
          question: "Comment supprimer mon compte ?",
          answer: "Pour supprimer votre compte, connectez-vous, accédez à vos paramètres de compte, puis cliquez sur 'Supprimer mon compte'. Notez que cette action est irréversible et que toutes vos données seront définitivement supprimées."
        },
        {
          id: "q12",
          question: "Comment changer mon mot de passe ?",
          answer: "Pour changer votre mot de passe, connectez-vous à votre compte, accédez à vos paramètres de sécurité, puis cliquez sur 'Modifier le mot de passe'. Vous devrez entrer votre ancien mot de passe ainsi que votre nouveau mot de passe."
        }
      ]
    },
    {
      title: "Problèmes et assistance",
      questions: [
        {
          id: "q13",
          question: "Que faire si le bateau ne correspond pas à la description ?",
          answer: "Si le bateau ne correspond pas à la description, prenez des photos pour documenter les différences et contactez immédiatement notre service client au +33 (0)1 23 45 67 89. Ne signez pas l'état des lieux avant que la situation ne soit résolue."
        },
        {
          id: "q14",
          question: "Comment contacter le service client ?",
          answer: "Vous pouvez contacter notre service client par téléphone au +33 (0)1 23 45 67 89 (du lundi au vendredi, de 9h à 18h), par e-mail à support@sailingloc.com, ou via le formulaire de contact sur notre site."
        },
        {
          id: "q15",
          question: "Que faire en cas de retard pour la prise en charge ou le retour du bateau ?",
          answer: "En cas de retard, informez immédiatement le propriétaire ou notre service client. Un retard pour le retour du bateau peut entraîner des frais supplémentaires, car cela peut impacter la location suivante."
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Link to="/help" style={{ color: '#274991', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Retour à l'aide
          </Link>
        </div>

        <h1 style={{ color: '#274991', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: '15px' }} />
          Questions fréquentes (FAQ)
        </h1>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
            Retrouvez les réponses aux questions les plus fréquemment posées par nos utilisateurs. Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à contacter notre service client.
          </p>
        </div>

        {/* Affichage des catégories de FAQ */}
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
              {category.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {category.questions.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    backgroundColor: '#f9f9f9', 
                    padding: '15px', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleQuestion(item.id)}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: '#274991',
                    fontWeight: 'bold'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.question}</h3>
                    <FontAwesomeIcon 
                      icon={openQuestions[item.id] ? faChevronUp : faChevronDown} 
                      style={{ transition: 'transform 0.3s ease' }}
                    />
                  </div>
                  {openQuestions[item.id] && (
                    <div style={{ 
                      marginTop: '15px', 
                      paddingTop: '15px', 
                      borderTop: '1px solid #ddd',
                      lineHeight: '1.6',
                      color: '#444'
                    }}>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '40px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#274991', marginBottom: '10px' }}>Vous n'avez pas trouvé la réponse à votre question ?</h3>
          <p style={{ marginBottom: '20px' }}>Notre équipe d'assistance est là pour vous aider.</p>
          <Link to="/contact" style={{ 
            backgroundColor: '#274991', 
            color: 'white', 
            padding: '12px 25px', 
            borderRadius: '4px', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Contactez-nous
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

export default FAQ;
