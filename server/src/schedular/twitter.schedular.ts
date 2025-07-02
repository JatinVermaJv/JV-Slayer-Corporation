import cron, { ScheduledTask } from 'node-cron';
import { TwitterService } from '../services/twitter.service';
import { ScheduledTweet } from '../types/index';

export class TwitterScheduler {
  private twitterService: TwitterService;
  private scheduledJobs: Map<string, ScheduledTask>;

  constructor() {
    this.twitterService = new TwitterService();
    this.scheduledJobs = new Map();
  }

  // Schedule a single tweet
  scheduleTweet(scheduleId: string, cronExpression: string, tweetContent: string): void {
    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    // Cancel existing job if exists
    this.cancelScheduledTweet(scheduleId);

    // Create new scheduled job
    const job = cron.schedule(cronExpression, async () => {
      try {
        await this.twitterService.postTweet(tweetContent);
      } catch (error) {
        console.error(`Failed to post scheduled tweet ${scheduleId}:`, error);
      }
    });

    this.scheduledJobs.set(scheduleId, job);
    console.log(`Tweet scheduled with ID: ${scheduleId}`);
  }

  // Schedule recurring tweets
  scheduleRecurringTweets(scheduleId: string, cronExpression: string, tweetsGenerator: () => string): void {
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    this.cancelScheduledTweet(scheduleId);

    const job = cron.schedule(cronExpression, async () => {
      try {
        const content = tweetsGenerator();
        await this.twitterService.postTweet(content);
      } catch (error) {
        console.error(`Failed to post recurring tweet ${scheduleId}:`, error);
      }
    });

    this.scheduledJobs.set(scheduleId, job);
    console.log(`Recurring tweets scheduled with ID: ${scheduleId}`);
  }

  // Cancel a scheduled tweet
  cancelScheduledTweet(scheduleId: string): boolean {
    const job = this.scheduledJobs.get(scheduleId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(scheduleId);
      console.log(`Scheduled tweet ${scheduleId} cancelled`);
      return true;
    }
    return false;
  }

  // Get all active schedules
  getActiveSchedules(): string[] {
    return Array.from(this.scheduledJobs.keys());
  }

  // Start all scheduled jobs
  startAll(): void {
    this.scheduledJobs.forEach((job, id) => {
      job.start();
      console.log(`Started schedule: ${id}`);
    });
  }

  // Stop all scheduled jobs
  stopAll(): void {
    this.scheduledJobs.forEach((job, id) => {
      job.stop();
      console.log(`Stopped schedule: ${id}`);
    });
  }
}