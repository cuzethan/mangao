import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import CONFIG from '../config/env.ts'

interface UserRequest extends Request {
    user?: JwtPayload
}

export function validateSession(req: UserRequest, res: Response, next: NextFunction) {
    const { accessToken = undefined, csrfToken = undefined } = req.cookies

    if (csrfToken === undefined) return res.status(403).send("No cookies! Need to log in!");
    
    const csrfTokenAlt = req.headers['x-csrf-token'];
    
    if (csrfToken !== csrfTokenAlt) return res.status(403).send("Invalid CSRF validation!");

    if (!accessToken) return res.status(401).send("Access token is not provided!")

    jwt.verify(accessToken, CONFIG.ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
        if (err) return res.status(401).json(
            {
                action: "refreshReq",
                msg: "Token expired or invalid!"
            }) //notify refresh token
        req.user = decoded as JwtPayload;
        next()
    })
}