import { useState, useEffect } from 'react';
import boatService from '../services/boat.service';

export function useBoatCount(destinationName) {
  const [boatCount, setBoatCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchBoatCount = async () => {
      try {
        // 1) Vérifier le cache d'abord pour une expérience plus rapide
        const cachedBoats = localStorage.getItem('boatsCache');
        if (cachedBoats) {
          const boats = JSON.parse(cachedBoats);
          const filteredBoats = boats.filter(boat => 
            boat.location?.toLowerCase() === destinationName.toLowerCase() ||
            boat.city?.toLowerCase() === destinationName.toLowerCase() ||
            boat.port?.toLowerCase() === destinationName.toLowerCase() ||
            boat.destination?.toLowerCase() === destinationName.toLowerCase()
          );
          
          if (mounted) {
            setBoatCount(filteredBoats.length);
          }
        }

        // 2) Rafraîchir depuis l'API pour avoir la valeur la plus à jour
        const data = await boatService.getAllBoats({ location: destinationName });
        if (mounted && Array.isArray(data)) {
          // Si l'API a déjà filtré, on prend directement la longueur. Sinon, on filtre côté client.
          const looksFiltered = data.every(boat =>
            [boat.location, boat.city, boat.port, boat.destination]
              .map(v => (typeof v === 'string' ? v.toLowerCase() : ''))
              .includes(destinationName.toLowerCase())
          );
          const finalCount = looksFiltered
            ? data.length
            : data.filter(boat =>
                boat.location?.toLowerCase() === destinationName.toLowerCase() ||
                boat.city?.toLowerCase() === destinationName.toLowerCase() ||
                boat.port?.toLowerCase() === destinationName.toLowerCase() ||
                boat.destination?.toLowerCase() === destinationName.toLowerCase()
              ).length;
          setBoatCount(finalCount);

          // Met à jour le cache avec la dernière liste complète si elle est fournie
          try {
            if (!looksFiltered) {
              localStorage.setItem('boatsCache', JSON.stringify(data));
            }
          } catch (_) {
            // ignore quota/storage errors
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Erreur lors du chargement des données');
          console.error('Erreur:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBoatCount();

    return () => {
      mounted = false;
    };
  }, [destinationName]);

  return { boatCount, isLoading, error };
}
