const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface TweetResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export const twitterAPI = {
  // Post immediate tweet
  async postTweet(content: string): Promise<TweetResponse> {
    const response = await fetch(`${API_BASE_URL}/twitter/tweet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Schedule a tweet
  async scheduleTweet(scheduleId: string, cronExpression: string, content: string): Promise<TweetResponse> {
    const response = await fetch(`${API_BASE_URL}/twitter/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId, cronExpression, content }),
    });
    return response.json();
  },

  // Get active schedules
  async getSchedules(): Promise<TweetResponse> {
    const response = await fetch(`${API_BASE_URL}/twitter/schedules`);
    return response.json();
  },

  // Cancel scheduled tweet
  async cancelSchedule(scheduleId: string): Promise<TweetResponse> {
    const response = await fetch(`${API_BASE_URL}/twitter/schedule/${scheduleId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};