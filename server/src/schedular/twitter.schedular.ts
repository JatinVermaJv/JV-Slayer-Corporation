import cron, { ScheduledTask } from 'node-cron';
import { TwitterService } from '../services/twitter.service';
import { ScheduledTweet } from '../types';
import { tokenStorage } from '../services/tokenStorage.service';

interface UserScheduledJob {
  job: ScheduledTask;
  userId: string;
  content: string;
}

export class TwitterScheduler {
  private scheduledJobs: Map<string, UserScheduledJob>;

  constructor() {
    this.scheduledJobs = new Map();
  }

  // Schedule a tweet for a specific user
  scheduleTweet(
    scheduleId: string, 
    userId: string, 
    cronExpression: string, 
    tweetContent: string
  ): void {
    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    // Cancel existing job if exists
    this.cancelScheduledTweet(scheduleId);

    // Create new scheduled job
    const job = cron.schedule(cronExpression, async () => {
      try {
        // Get user's tokens
        const userTokens = tokenStorage.getTokens(userId);
        if (!userTokens) {
          console.error(`No tokens found for user ${userId}`);
          return;
        }

        // Create Twitter service with user's token
        const twitterService = new TwitterService(userTokens.accessToken);
        await twitterService.postTweet(tweetContent);
      } catch (error) {
        console.error(`Failed to post scheduled tweet ${scheduleId}:`, error);
      }
    });

    this.scheduledJobs.set(scheduleId, { job, userId, content: tweetContent });
    console.log(`Tweet scheduled with ID: ${scheduleId} for user: ${userId}`);
  }

  // Schedule recurring tweets for a user
  scheduleRecurringTweets(
    scheduleId: string, 
    userId: string,
    cronExpression: string, 
    tweetsGenerator: () => string
  ): void {
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    this.cancelScheduledTweet(scheduleId);

    const job = cron.schedule(cronExpression, async () => {
      try {
        // Get user's tokens
        const userTokens = tokenStorage.getTokens(userId);
        if (!userTokens) {
          console.error(`No tokens found for user ${userId}`);
          return;
        }

        const content = tweetsGenerator();
        const twitterService = new TwitterService(userTokens.accessToken);
        await twitterService.postTweet(content);
      } catch (error) {
        console.error(`Failed to post recurring tweet ${scheduleId}:`, error);
      }
    });

    this.scheduledJobs.set(scheduleId, { job, userId, content: 'Recurring tweet' });
    console.log(`Recurring tweets scheduled with ID: ${scheduleId} for user: ${userId}`);
  }

  // Get schedules for a specific user
  getUserSchedules(userId: string): string[] {
    const userSchedules: string[] = [];
    this.scheduledJobs.forEach((value, key) => {
      if (value.userId === userId) {
        userSchedules.push(key);
      }
    });
    return userSchedules;
  }

  // Cancel a scheduled tweet
  cancelScheduledTweet(scheduleId: string): boolean {
    const scheduledJob = this.scheduledJobs.get(scheduleId);
    if (scheduledJob) {
      scheduledJob.job.stop();
      this.scheduledJobs.delete(scheduleId);
      console.log(`Scheduled tweet ${scheduleId} cancelled`);
      return true;
    }
    return false;
  }
}