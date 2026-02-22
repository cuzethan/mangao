import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import CONFIG from '../config/env.ts'

export function validateSession(req: Request, res: Response, next: NextFunction) {
    const { accessToken = undefined, csrfToken = undefined } = req.cookies

    if (csrfToken === undefined) return res.status(401).send("No cookies! Need to log in!");
    
    const csrfTokenAlt = req.headers['x-csrf-token'];
    
    if (csrfToken !== csrfTokenAlt) return res.status(401).send("Invalid CSRF validation!");

    jwt.verify(accessToken, CONFIG.ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
        if (err) return res.sendStatus(401);
        req.user = decoded as JwtPayload
        next()
    })
}