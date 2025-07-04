import { Request, Response, NextFunction } from 'express';
import { TwitterApi } from 'twitter-api-v2';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    accessToken: string;
    refreshToken?: string;
    twitterUsername?: string;
  };
}

export const authenticateTwitterUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No authorization token provided',
        code: 'NO_AUTH_TOKEN'
      });
    }

    const accessToken = authHeader.substring(7);

    // Validate the token by making a request to Twitter
    try {
      const client = new TwitterApi(accessToken);
      const me = await client.v2.me();
      
      // Token is valid, attach user info
      req.user = {
        id: me.data.id,
        accessToken: accessToken,
        twitterUsername: me.data.username
      };

      next();
    } catch (twitterError: any) {
      console.error('Twitter validation error:', twitterError);
      
      if (twitterError.code === 401) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid Twitter access token',
          code: 'INVALID_TWITTER_TOKEN'
        });
      }

      throw twitterError;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};