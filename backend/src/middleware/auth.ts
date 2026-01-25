import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken';
import CONFIG from '../config/env.ts'

export interface UserPayload extends JwtPayload {
    username: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user as UserPayload;
        next()
    })
}