import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  useEffect(() => {
    document.title = 'Politique de cookies - SailingLoc';
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Découvrez comment SailingLoc utilise les cookies pour améliorer votre expérience utilisateur et comment vous pouvez les gérer.';
    document.head.appendChild(metaDescription);
    
    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Politique de cookies</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="mb-4 text-gray-700">
          Dernière mise à jour : 7 septembre 2024
        </p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
          <p className="mb-4 text-gray-700">
            Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
            Il permet au site de mémoriser vos actions et préférences (telles que la connexion, la langue, 
            la taille des caractères et d'autres préférences d'affichage) sur une période donnée, 
            pour que vous n'ayez pas à les réinsérer à chaque fois que vous consultez le site ou naviguez d'une page à une autre.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Les cookies que nous utilisons</h2>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Cookies essentiels</h3>
          <p className="mb-4 text-gray-700">
            Ces cookies sont nécessaires au bon fonctionnement de notre site. Ils vous permettent d'utiliser 
            les fonctionnalités principales et de naviguer sur le site. Sans ces cookies, certains services 
            ne peuvent pas fonctionner correctement.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Cookies de performance</h3>
          <p className="mb-4 text-gray-700">
            Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant 
            des informations de manière anonyme. Ces données nous permettent d'améliorer constamment notre site.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Cookies de fonctionnalité</h3>
          <p className="mb-4 text-gray-700">
            Ces cookies permettent au site de se souvenir des choix que vous faites (comme votre nom d'utilisateur, 
            votre langue ou la région dans laquelle vous vous trouvez) et de fournir des fonctionnalités améliorées 
            et plus personnelles.
          </p>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Cookies de ciblage</h3>
          <p className="mb-4 text-gray-700">
            Ces cookies peuvent être définis via notre site par nos partenaires publicitaires. Ils peuvent être 
            utilisés par ces entreprises pour établir un profil de vos intérêts et vous montrer des publicités 
            pertinentes sur d'autres sites.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Comment gérer les cookies</h2>
          <p className="mb-4 text-gray-700">
            Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Pour plus d'informations, 
            consultez le site <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aboutcookies.org</a>.
          </p>
          <p className="mb-4 text-gray-700">
            Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et configurer la plupart des navigateurs 
            pour les empêcher d'être enregistrés. Toutefois, dans ce cas, vous devrez peut-être indiquer manuellement 
            certaines préférences à chaque visite du site, et certains services et fonctionnalités pourraient ne pas être disponibles.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Modifications de notre politique de cookies</h2>
          <p className="mb-4 text-gray-700">
            Nous pouvons mettre à jour notre politique de cookies de temps à autre. Nous vous informerons de tout changement 
            en publiant la nouvelle politique sur cette page.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Contact</h2>
          <p className="mb-4 text-gray-700">
            Si vous avez des questions concernant cette politique de cookies, vous pouvez nous contacter à l'adresse 
            <a href="mailto:contact@sailingloc.com" className="text-blue-600 hover:underline ml-1">
              contact@sailingloc.com
            </a>.
          </p>
        </section>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link to="/" className="text-blue-600 hover:underline">
            &larr; Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
