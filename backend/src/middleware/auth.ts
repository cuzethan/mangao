import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

export function validateSession(req: Request, res: Response, next: NextFunction) {
    const { accessToken = undefined, csrfToken = undefined } = req.cookies

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (ACCESS_TOKEN_SECRET === undefined) {
        console.error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
        return res.status(500).send("Server configuration error.");
    }

    if (csrfToken === undefined) return res.status(401).send("No cookies! Need to log in!");
    
    const csrfTokenAlt = req.headers['x-csrf-token'];
    
    if (csrfToken !== csrfTokenAlt) return res.status(401).send("Invalid CSRF validation!");

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
        if (err) return res.sendStatus(401);
        req.user = decoded as JwtPayload
        next()
    })
}