import { Router, Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

interface AuthRequest extends Request {
  user?: {
    id: string;
    accessToken: string;
    refreshToken?: string;
    twitterId?: string;
    username?: string;
    email?: string;
  };
}

const router = Router();

// Authentication middleware
const authenticateTwitterUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
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
          refreshToken: sessionData.refreshToken,
          twitterId: sessionData.twitterId,
          username: sessionData.username,
          email: sessionData.email
        };
        next();
      } else {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid session data',
          code: 'INVALID_SESSION'
        });
      }
    } catch (decodeError) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// Create or update Twitter user
router.post('/connect', authenticateTwitterUser, async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      res.status(400).json({ 
        success: false, 
        error: 'User data not found' 
      });
      return;
    }

    const userData = {
      twitterId: user.twitterId || user.id,
      username: user.username,
      email: user.email || `${user.username}@twitter.local`,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      name: user.username || 'Twitter User'
    };

    const dbUser = await userService.createOrUpdateTwitterUser(userData);
    
    res.json({
      success: true,
      data: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        twitterUsername: dbUser.twitterUsername,
        connected: true
      }
    });
  } catch (error) {
    console.error('Error connecting Twitter user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect Twitter user' 
    });
  }
});

// Get user profile
router.get('/profile', authenticateTwitterUser, async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      res.status(400).json({ 
        success: false, 
        error: 'User data not found' 
      });
      return;
    }

    const dbUser = await userService.getUserByTwitterId(user.twitterId || user.id);
    
    if (!dbUser) {
      res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        twitterUsername: dbUser.twitterUsername,
        createdAt: dbUser.createdAt,
        lastLogin: dbUser.lastLogin
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user profile' 
    });
  }
});

// Update last login
router.post('/login', authenticateTwitterUser, async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      res.status(400).json({ 
        success: false, 
        error: 'User data not found' 
      });
      return;
    }

    await userService.updateLastLogin(user.twitterId || user.id);
    
    res.json({
      success: true,
      message: 'Login recorded successfully'
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update login' 
    });
  }
});

// Disconnect Twitter account
router.post('/disconnect', authenticateTwitterUser, async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    
    if (!user) {
      res.status(400).json({ 
        success: false, 
        error: 'User data not found' 
      });
      return;
    }

    await userService.disconnectTwitterUser(user.twitterId || user.id);
    
    res.json({
      success: true,
      message: 'Twitter account disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Twitter user:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to disconnect Twitter account' 
    });
  }
});

export default router;
