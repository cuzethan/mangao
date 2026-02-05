import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import CONFIG from '../config/env.ts'

interface UserRequest extends Request {
    user?: JwtPayload
}

export function authenticateToken(req: UserRequest, res: Response, next: NextFunction) {
    const { accessToken, csrfToken } = req.cookies
    
    let csrfTokenAlt;
    const header = req.headers['X-CSRF-TOKEN'];
    if (header && typeof header == "string") { 
        csrfTokenAlt = header.split(' ') 
    }
    
    if (csrfToken !== csrfTokenAlt)  return res.sendStatus(403);

    jwt.verify(accessToken, CONFIG.ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
        if (err) return res.sendStatus(401)
        req.user = decoded as JwtPayload;
        next()
    })
}