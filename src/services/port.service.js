// port.service.js
// Service pour la gestion des ports et marinas

// Liste des ports populaires en France et en Europe
const ports = [
  // France - Méditerranée
  { id: 1, name: "Marseille", country: "France", region: "Méditerranée", boatCount: 120 },
  { id: 2, name: "Nice", country: "France", region: "Méditerranée", boatCount: 95 },
  { id: 3, name: "Cannes", country: "France", region: "Méditerranée", boatCount: 110 },
  { id: 4, name: "Saint-Tropez", country: "France", region: "Méditerranée", boatCount: 85 },
  { id: 5, name: "Antibes", country: "France", region: "Méditerranée", boatCount: 75 },
  { id: 6, name: "Toulon", country: "France", region: "Méditerranée", boatCount: 90 },
  { id: 7, name: "Bastia", country: "France", region: "Corse", boatCount: 65 },
  { id: 8, name: "Ajaccio", country: "France", region: "Corse", boatCount: 70 },
  { id: 9, name: "Porto-Vecchio", country: "France", region: "Corse", boatCount: 55 },
  { id: 10, name: "Bonifacio", country: "France", region: "Corse", boatCount: 60 },
  
  // France - Atlantique
  { id: 11, name: "La Rochelle", country: "France", region: "Atlantique", boatCount: 100 },
  { id: 12, name: "Brest", country: "France", region: "Atlantique", boatCount: 80 },
  { id: 13, name: "Lorient", country: "France", region: "Atlantique", boatCount: 75 },
  { id: 14, name: "Saint-Malo", country: "France", region: "Manche", boatCount: 65 },
  { id: 15, name: "Cherbourg", country: "France", region: "Manche", boatCount: 60 },
  { id: 16, name: "Arcachon", country: "France", region: "Atlantique", boatCount: 85 },
  { id: 17, name: "Biarritz", country: "France", region: "Atlantique", boatCount: 70 },
  
  // Espagne
  { id: 18, name: "Barcelone", country: "Espagne", region: "Méditerranée", boatCount: 130 },
  { id: 19, name: "Palma de Majorque", country: "Espagne", region: "Baléares", boatCount: 120 },
  { id: 20, name: "Ibiza", country: "Espagne", region: "Baléares", boatCount: 100 },
  { id: 21, name: "Valence", country: "Espagne", region: "Méditerranée", boatCount: 90 },
  { id: 22, name: "Malaga", country: "Espagne", region: "Méditerranée", boatCount: 85 },
  { id: 23, name: "Porto Cristo", country: "Espagne", region: "Baléares", boatCount: 85 },
  
  // Italie
  { id: 24, name: "Naples", country: "Italie", region: "Méditerranée", boatCount: 110 },
  { id: 25, name: "Gênes", country: "Italie", region: "Méditerranée", boatCount: 95 },
  { id: 26, name: "Venise", country: "Italie", region: "Adriatique", boatCount: 85 },
  { id: 27, name: "Cagliari", country: "Italie", region: "Sardaigne", boatCount: 75 },
  { id: 28, name: "Palerme", country: "Italie", region: "Sicile", boatCount: 80 },
  
  // Grèce
  { id: 29, name: "Athènes", country: "Grèce", region: "Méditerranée", boatCount: 140 },
  { id: 30, name: "Mykonos", country: "Grèce", region: "Cyclades", boatCount: 90 },
  { id: 31, name: "Santorin", country: "Grèce", region: "Cyclades", boatCount: 85 },
  { id: 32, name: "Corfou", country: "Grèce", region: "Ionienne", boatCount: 95 },
  
  // Croatie
  { id: 33, name: "Split", country: "Croatie", region: "Adriatique", boatCount: 110 },
  { id: 34, name: "Dubrovnik", country: "Croatie", region: "Adriatique", boatCount: 100 },
  { id: 35, name: "Hvar", country: "Croatie", region: "Adriatique", boatCount: 80 },
  
  // Portugal
  { id: 36, name: "Lisbonne", country: "Portugal", region: "Atlantique", boatCount: 90 },
  { id: 37, name: "Porto", country: "Portugal", region: "Atlantique", boatCount: 75 },
  { id: 38, name: "Faro", country: "Portugal", region: "Algarve", boatCount: 85 },
  
  // Autres
  { id: 39, name: "Monaco", country: "Monaco", region: "Méditerranée", boatCount: 95 },
  { id: 40, name: "Amsterdam", country: "Pays-Bas", region: "Mer du Nord", boatCount: 70 }
];

/**
 * Recherche des ports par nom
 * @param {string} query - Terme de recherche
 * @returns {Array} - Liste des ports correspondants
 */
const searchPorts = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return ports.filter(port => 
    port.name.toLowerCase().includes(normalizedQuery) || 
    port.country.toLowerCase().includes(normalizedQuery) ||
    port.region.toLowerCase().includes(normalizedQuery)
  ).slice(0, 10); // Limiter à 10 résultats pour éviter une liste trop longue
};

/**
 * Récupérer un port par son ID
 * @param {number} id - ID du port
 * @returns {Object|null} - Port trouvé ou null
 */
const getPortById = (id) => {
  return ports.find(port => port.id === id) || null;
};

/**
 * Récupérer tous les ports
 * @returns {Array} - Liste complète des ports
 */
const getAllPorts = () => {
  return [...ports];
};

/**
 * Récupérer les ports par pays
 * @param {string} country - Nom du pays
 * @returns {Array} - Liste des ports du pays
 */
const getPortsByCountry = (country) => {
  return ports.filter(port => 
    port.country.toLowerCase() === country.toLowerCase()
  );
};

export default {
  searchPorts,
  getPortById,
  getAllPorts,
  getPortsByCountry
};
