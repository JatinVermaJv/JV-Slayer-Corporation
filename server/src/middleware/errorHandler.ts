import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.code === 401 || err.statusCode === 401) {
    return res.status(401).json({
      success: false,
      error: 'Twitter authentication failed. Please re-login.',
      code: 'TWITTER_AUTH_FAILED'
    });
  }

  if (err.code === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};