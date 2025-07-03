export interface ScheduledTweet {
  id: string;
  content: string;
  cronExpression: string;
  nextRun?: string;
}

export interface CronPreset {
  label: string;
  value: string;
  description: string;
}