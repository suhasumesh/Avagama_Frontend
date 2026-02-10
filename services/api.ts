
/**
 * API Service for Avagama AI
 * Integrated with local Node.js/Express backend at http://localhost:5000/api
 */

const BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Auth endpoints
  auth: {
    login: async (credentials: any) => {
      try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
      } catch (error: any) {
        throw error;
      }
    },
    register: async (userData: any) => {
      try {
        // Updated to /auth/signup to match backend screenshots
        const response = await fetch(`${BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
      } catch (error: any) {
        throw error;
      }
    }
  },

  // Evaluation endpoints
  evaluations: {
    list: async () => {
      const response = await fetch(`${BASE_URL}/evaluations`);
      return response.json();
    },
    create: async (data: any) => {
      const response = await fetch(`${BASE_URL}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    get: async (id: string) => {
      const response = await fetch(`${BASE_URL}/evaluations/${id}`);
      return response.json();
    }
  },

  // AI Discovery / Mistral Agent endpoints
  discovery: {
    runAgent: async (params: any) => {
      const response = await fetch(`${BASE_URL}/discovery/mistral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response.json();
    }
  }
};
