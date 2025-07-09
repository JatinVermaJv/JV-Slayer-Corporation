import { getSession } from 'next-auth/react';

const API_BASE_URL = 'http://localhost:3001/api/twitter-user';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error('No access token found');
  }

  const tokenData = {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    id: session.user.id,
    username: session.user.name,
    email: session.user.email,
    twitterId: session.user.id
  };

  const encodedToken = Buffer.from(JSON.stringify(tokenData)).toString('base64');

  return {
    'Authorization': `Bearer ${encodedToken}`,
    'Content-Type': 'application/json',
  };
};

export const twitterUserAPI = {
  // Connect Twitter user to database
  async connectUser() {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/connect`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to connect Twitter user');
    }

    return response.json();
  },

  // Get user profile
  async getProfile() {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user profile');
    }

    return response.json();
  },

  // Record login
  async recordLogin() {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to record login');
    }

    return response.json();
  },

  // Disconnect Twitter account
  async disconnect() {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/disconnect`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to disconnect Twitter account');
    }

    return response.json();
  }
};
