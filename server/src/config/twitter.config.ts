import { TwitterApi } from 'twitter-api-v2';

// Create a function to get client with user's access token
export const createTwitterClient = (accessToken: string) => {
  return new TwitterApi(accessToken);
};

// For OAuth 2.0 with refresh token support
export const createTwitterClientWithRefresh = (accessToken: string, refreshToken?: string) => {
  return new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  }).readOnly; // We'll use the access token directly
};