
import { Decision, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = (): string | null => {
  return localStorage.getItem('dt_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('dt_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('dt_token');
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const storageService = {
  // Auth methods
  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error('Registration failed');
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  logout: (): void => {
    removeToken();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = getToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        removeToken();
        return null;
      }
      return await response.json();
    } catch {
      return null;
    }
  },

  setUser: (user: User | null): void => {
    if (!user) {
      removeToken();
    }
  },

  // Decision methods
  getDecisions: async (): Promise<Decision[]> => {
    const response = await fetch(`${API_URL}/decisions`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch decisions');
    return await response.json();
  },

  saveDecision: async (decision: Omit<Decision, 'id' | 'userId' | 'createdAt'>): Promise<Decision> => {
    const url = decision.id ? `${API_URL}/decisions/${decision.id}` : `${API_URL}/decisions`;
    const method = decision.id ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(decision)
    });
    if (!response.ok) throw new Error('Failed to save decision');
    return await response.json();
  },

  deleteDecision: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/decisions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete decision');
  },

  addReview: async (id: string, review: any): Promise<Decision> => {
    const response = await fetch(`${API_URL}/decisions/${id}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(review)
    });
    if (!response.ok) throw new Error('Failed to add review');
    return await response.json();
  }
};
