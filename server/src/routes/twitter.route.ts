import { Router, Request, Response, NextFunction } from 'express';
import { TwitterScheduler } from '../schedular/twitter.schedular';
import { TwitterService } from '../services/twitter.service';
import { tokenStorage } from '../services/tokenStorage.service';
import { CleanupService } from '../services/cleanup.service';

interface AuthRequest extends Request {
  user?: {
    id: string;
    accessToken: string;
    refreshToken?: string;
  };
}

const router = Router();
const twitterScheduler = new TwitterScheduler();

// Authentication middleware
const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false, 
        error: 'No authorization token provided',
        code: 'NO_AUTH_TOKEN'
      });
      return;
    }

    const token = authHeader.substring(7);

    // Try to decode base64 session data
    try {
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      const sessionData = JSON.parse(decodedToken);
      
      if (sessionData && sessionData.accessToken) {
        req.user = {
          id: sessionData.id || sessionData.sub || 'twitter-user',
          accessToken: sessionData.accessToken,
          refreshToken: sessionData.refreshToken
        };

        // Store tokens for scheduled tweets
        tokenStorage.saveTokens(
          req.user.id,
          req.user.accessToken,
          req.user.refreshToken
        );

        next();
        return;
      }
    } catch (error) {
      console.log('Failed to decode as base64 session, trying direct token');
    }

    // If not base64, might be direct access token
    if (token && token.length > 20) {
      req.user = {
        id: 'twitter-user',
        accessToken: token,
        refreshToken: undefined
      };

      next();
      return;
    }

    res.status(401).json({ 
      success: false, 
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN'
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// Apply authentication middleware
router.use(authenticateUser);

// Post immediate tweet - Fixed: returns void
router.post('/tweet', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      res.status(400).json({ 
        success: false, 
        error: 'Tweet content cannot be empty' 
      });
      return;
    }

    if (content.length > 280) {
      res.status(400).json({ 
        success: false, 
        error: 'Tweet exceeds 280 character limit' 
      });
      return;
    }

    const twitterService = new TwitterService(req.user!.accessToken);
    const result = await twitterService.postTweet(content);
    
    res.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error('Tweet posting error:', error);
    
    if (error.code === 401) {
      res.status(401).json({ 
        success: false, 
        error: 'Twitter authentication failed. Please re-login.',
        code: 'TWITTER_AUTH_FAILED'
      });
      return;
    }
    
    if (error.code === 429) {
      res.status(429).json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to post tweet' 
    });
  }
});

// Post thread - Fixed: returns void
router.post('/thread', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tweets } = req.body;
    
    if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
      res.status(400).json({ 
        success: false, 
        error: 'Tweets array is required and cannot be empty' 
      });
      return;
    }

    // Validate each tweet
    for (let i = 0; i < tweets.length; i++) {
      if (!tweets[i] || tweets[i].trim().length === 0) {
        res.status(400).json({ 
          success: false, 
          error: `Tweet ${i + 1} cannot be empty` 
        });
        return;
      }
      if (tweets[i].length > 280) {
        res.status(400).json({ 
          success: false, 
          error: `Tweet ${i + 1} exceeds 280 character limit` 
        });
        return;
      }
    }

    const twitterService = new TwitterService(req.user!.accessToken);
    await twitterService.postThreadTweet(tweets);
    
    res.json({ success: true, message: 'Thread posted successfully' });
  } catch (error: any) {
    console.error('Thread posting error:', error);
    
    if (error.code === 401) {
      res.status(401).json({ 
        success: false, 
        error: 'Twitter authentication failed. Please re-login.',
        code: 'TWITTER_AUTH_FAILED'
      });
      return;
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to post thread' 
    });
  }
});

// Schedule a tweet - Fixed: returns void
router.post('/schedule', (req: AuthRequest, res: Response): void => {
  try {
    const { scheduleId, cronExpression, content } = req.body;
    
    // Validate inputs
    if (!scheduleId || !cronExpression || !content) {
      res.status(400).json({ 
        success: false, 
        error: 'Schedule ID, cron expression, and content are required' 
      });
      return;
    }

    if (content.length > 280) {
      res.status(400).json({ 
        success: false, 
        error: 'Tweet exceeds 280 character limit' 
      });
      return;
    }

    const userId = req.user!.id;
    
    twitterScheduler.scheduleTweet(
      `${userId}_${scheduleId}`,
      userId,
      cronExpression, 
      content
    );
    
    res.json({ success: true, message: 'Tweet scheduled successfully' });
  } catch (error: any) {
    console.error('Scheduling error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Failed to schedule tweet' 
    });
  }
});

// Get user's scheduled tweets
router.get('/schedules', (req: AuthRequest, res: Response): void => {
  try {
    const userSchedules = twitterScheduler.getUserSchedules(req.user!.id);
    res.json({ success: true, data: userSchedules });
  } catch (error: any) {
    console.error('Get schedules error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch schedules' 
    });
  }
});

// Cancel scheduled tweet
router.delete('/schedule/:scheduleId', (req: AuthRequest, res: Response): void => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user!.id;
    const fullScheduleId = `${userId}_${scheduleId}`;
    
    const cancelled = twitterScheduler.cancelScheduledTweet(fullScheduleId);

    if (cancelled) {
      res.json({ success: true, message: 'Schedule cancelled' });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Schedule not found' 
      });
    }
  } catch (error: any) {
    console.error('Cancel schedule error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel schedule' 
    });
  }
});

// Logout and cleanup
router.post('/logout', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cleanupService = new CleanupService(twitterScheduler);
    await cleanupService.cleanupUserData(req.user!.id);
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Logout failed' 
    });
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response): void => {
  res.json({ 
    success: true, 
    message: 'Twitter API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;