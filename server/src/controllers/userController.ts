import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';

export const createUser = async (req: Request, res: Response)=> {
    try {
        const user = await userService.createUser(req.body);
        return res.json(user);
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid password') {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        return res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.loginUser(req.body);
        return res.json(user);
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
};