import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface TweetResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}


// Also create a version that sends the entire session as JWT
async function getAuthHeadersWithSession() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('No session available');
  }

  // Create a JWT-like token with session data
  const sessionToken = btoa(JSON.stringify({
    id: session.user?.id,
    sub: session.user?.id,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    provider: 'twitter'
  }));

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`,
  };
}

export const twitterAPI = {
  // Post immediate tweet
  async postTweet(content: string): Promise<TweetResponse> {
    try {
      const headers = await getAuthHeadersWithSession(); // Use session token
      
      const response = await fetch(`${API_BASE_URL}/twitter/tweet`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          window.location.href = '/login';
        }
        throw new Error(error.error || 'Failed to post tweet');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error posting tweet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to post tweet'
      };
    }
  },

  // Apply same pattern to other methods...
  async scheduleTweet(scheduleId: string, cronExpression: string, content: string): Promise<TweetResponse> {
    try {
      const headers = await getAuthHeadersWithSession();
      
      const response = await fetch(`${API_BASE_URL}/twitter/schedule`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ scheduleId, cronExpression, content }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          window.location.href = '/login';
        }
        throw new Error(error.error || 'Failed to schedule tweet');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error scheduling tweet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to schedule tweet'
      };
    }
  },

  async getSchedules(): Promise<TweetResponse> {
    try {
      const headers = await getAuthHeadersWithSession();
      
      const response = await fetch(`${API_BASE_URL}/twitter/schedules`, {
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          window.location.href = '/login';
        }
        throw new Error(error.error || 'Failed to fetch schedules');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schedules'
      };
    }
  },

  async cancelSchedule(scheduleId: string): Promise<TweetResponse> {
    try {
      const headers = await getAuthHeadersWithSession();
      
      const response = await fetch(`${API_BASE_URL}/twitter/schedule/${scheduleId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          window.location.href = '/login';
        }
        throw new Error(error.error || 'Failed to cancel schedule');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel schedule'
      };
    }
  },

  async logout(): Promise<TweetResponse> {
    try {
      const headers = await getAuthHeadersWithSession();
      
      const response = await fetch(`${API_BASE_URL}/twitter/logout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error during logout:', error);
      return {
        success: false,
        error: (error instanceof Error ? error.message : 'Logout failed')
      };
    }
  },
};