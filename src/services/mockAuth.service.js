// Service d'authentification simulé pour le développement frontend
// À utiliser uniquement pendant le développement en attendant que le backend soit prêt

// Base de données utilisateur simulée
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'tenant'
  },
  {
    id: '2',
    email: 'owner@example.com',
    name: 'Jane Smith',
    password: 'password123',
    role: 'owner'
  },
  {
    id: '3',
    email: 'c.line2110@hotmail.com',
    name: 'Céline',
    password: 'password123',
    role: 'owner'
  }
];

class MockAuthService {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.initFromStorage();
  }

  // Initialiser depuis le localStorage
  initFromStorage() {
    const user = localStorage.getItem('mockUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.isLoggedIn = true;
    }
  }

  // Simuler un délai réseau
  async delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Inscription
  async register(userData) {
    await this.delay();
    
    // Vérifier si l'email existe déjà
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw { message: 'Cet email est déjà utilisé.' };
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // En production, le mot de passe serait hashé
      role: userData.role || 'tenant'
    };
    
    // Ajouter à notre "base de données"
    mockUsers.push(newUser);
    
    // Créer un utilisateur sans le mot de passe pour le retourner
    const { password, ...userWithoutPassword } = newUser;
    
    // Stocker dans localStorage
    localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('mockToken', `mock-jwt-token-${Date.now()}`);
    
    this.currentUser = userWithoutPassword;
    this.isLoggedIn = true;
    
    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`
    };
  }

  // Connexion
  async login(email, password) {
    await this.delay();
    
    // Rechercher l'utilisateur
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      throw { message: 'Email ou mot de passe incorrect.' };
    }
    
    // Créer un utilisateur sans le mot de passe pour le retourner
    const { password: _, ...userWithoutPassword } = user;
    
    // Stocker dans localStorage
    localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('mockToken', `mock-jwt-token-${Date.now()}`);
    
    this.currentUser = userWithoutPassword;
    this.isLoggedIn = true;
    
    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`
    };
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockToken');
    this.currentUser = null;
    this.isLoggedIn = false;
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return this.isLoggedIn;
  }

  // Obtenir l'utilisateur courant
  async getCurrentUser() {
    await this.delay(300);
    return this.currentUser;
  }

  // Rafraîchir le token
  async refreshToken() {
    await this.delay();
    return {
      token: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`
    };
  }
}

export default new MockAuthService();
