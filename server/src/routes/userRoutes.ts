import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();


// Deprecated endpoints for credentials-based auth. Return 410 Gone.
// Use inline handler to avoid Express type inference issues for deprecated endpoints
router.post('/createUser', (req, res) => { res.status(410).json({ error: 'Credentials-based signup is no longer supported. Please sign in with Twitter.' }); });
router.post('/login', (req, res) => { res.status(410).json({ error: 'Credentials-based login is no longer supported. Please sign in with Twitter.' }); });

export default router;