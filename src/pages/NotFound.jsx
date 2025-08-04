import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6">
        <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18V12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 12L18 16L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12L6 16L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h1 className="font-pacifico text-primary text-4xl mb-2">Oups !</h1>
      <h2 className="font-montserrat text-2xl text-dark mb-6">Page non trouvée</h2>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        La page que vous recherchez semble avoir dérivé vers d'autres eaux. 
        Revenez à bon port en utilisant les liens ci-dessous.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link to="/" className="btn-primary px-8 py-3 text-center">
          Retour à l'accueil
        </Link>
        <Link to="/login" className="btn-secondary px-8 py-3 text-center">
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
