import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.post('/createUser', (req, res, next) => {
  userController.createUser(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  userController.loginUser(req, res).catch(next);
});

export default router;