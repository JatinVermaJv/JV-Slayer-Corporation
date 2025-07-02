export interface ScheduledTweet {
  id: string;
  content: string;
  cronExpression: string;
  isActive: boolean;
  createdAt: Date;
  nextRunTime?: Date;
}

export interface TweetTemplate {
  id: string;
  name: string;
  content: string;
  variables?: Record<string, string>;
}