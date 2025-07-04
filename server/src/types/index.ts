export interface ScheduledTweet {
  id: string;
  userId: string; // Add user ID
  content: string;
  cronExpression: string;
  isActive: boolean;
  createdAt: Date;
  nextRunTime?: Date;
}

export interface UserTwitterTokens {
  accessToken: string;
  refreshToken?: string;
  userId: string;
}

export interface TweetTemplate {
  id: string;
  userId: string;
  name: string;
  content: string;
  variables?: Record<string, string>;
}