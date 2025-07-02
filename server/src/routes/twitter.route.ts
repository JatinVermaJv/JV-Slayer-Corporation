import { Router, Request, Response } from 'express';
import { TwitterScheduler } from '../schedular/twitter.schedular';
import { TwitterService } from '../services/twitter.service';

const router = Router();
const twitterScheduler = new TwitterScheduler();
const twitterService = new TwitterService();

// Post immediate tweet
router.post('/tweet', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const result = await twitterService.postTweet(content);
    res.json({ success: true, data: result.data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Schedule a tweet
router.post('/schedule', (req: Request, res: Response) => {
  try {
    const { scheduleId, cronExpression, content } = req.body;
    twitterScheduler.scheduleTweet(scheduleId, cronExpression, content);
    res.json({ success: true, message: 'Tweet scheduled successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ success: false, error: errorMessage });
  }
});

// Cancel scheduled tweet
router.delete('/schedule/:scheduleId', (req: Request, res: Response) => {
  const { scheduleId } = req.params;
  const cancelled = twitterScheduler.cancelScheduledTweet(scheduleId);
  
  if (cancelled) {
    res.json({ success: true, message: 'Schedule cancelled' });
  } else {
    res.status(404).json({ success: false, error: 'Schedule not found' });
  }
});

// Get active schedules
router.get('/schedules', (req: Request, res: Response) => {
  const activeSchedules = twitterScheduler.getActiveSchedules();
  res.json({ success: true, data: activeSchedules });
});

export default router;