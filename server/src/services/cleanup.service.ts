import { tokenStorage } from './tokenStorage.service';
import { TwitterScheduler } from '../schedular/twitter.schedular';

export class CleanupService {
  constructor(private scheduler: TwitterScheduler) {}

  async cleanupUserData(userId: string): Promise<void> {
    // Remove stored tokens
    tokenStorage.removeTokens(userId);

    // Cancel all user's scheduled tweets
    const userSchedules = this.scheduler.getUserSchedules(userId);
    userSchedules.forEach(scheduleId => {
      this.scheduler.cancelScheduledTweet(scheduleId);
    });

    console.log(`Cleaned up data for user: ${userId}`);
  }
}