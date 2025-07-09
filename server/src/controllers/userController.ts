// Deprecated: Credentials-based user endpoints are removed in Twitter-only auth flow.
// This file is now obsolete and can be deleted, or endpoints should return 410 Gone.

import { Request, Response } from 'express';


export const createUser = (req: Request, res: Response) => {
  return res.status(410).json({ error: 'Credentials-based signup is no longer supported. Please sign in with Twitter.' });
};


export const loginUser = (req: Request, res: Response) => {
  return res.status(410).json({ error: 'Credentials-based login is no longer supported. Please sign in with Twitter.' });
};