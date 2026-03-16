import express from 'express'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { sendQuery } from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

router.get('/verify', validateSession, (req, res) => {
    res.status(200).send("Sucessfully verified")
})

router.get('/usernameCheck/:username', async (req, res) => {
    const username = req.params.username
    const query = `SELECT * FROM users WHERE username = $1`
    const user = (await sendQuery(query, [username])).rows[0]
    if(user) res.status(200).send(false) //notifies user already exists
    else res.status(200).send(true)
})

router.post('/signup', async (req, res) => {
    try {
        const username = req.body.username;
        const hashedPassword = await hash(req.body.password, 10) //10 is # of rounds for salt gen.
        const query = "INSERT INTO users (username, password_hashed) VALUES ($1, $2)";
        const values = [username, hashedPassword]
        await sendQuery(query, values);
        res.sendStatus(201);
    } catch (err) {
        //implement proper error catching from postgres with codes
        res.status(500).send(err)
    }
})

const isProduction = process.env.NODE_ENV === 'production'

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (ACCESS_TOKEN_SECRET === undefined) {
        console.error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
        return res.status(500).send("Server configuration error.");
    }
    const query = `SELECT * FROM users WHERE username = $1`
    const user = (await sendQuery(query, [username])).rows[0]
    if (user == null) return res.status(400).send("Login has failed.");

    const match = await compare(password, user.password_hashed);
    if (!match) return res.status(400).send('Login has failed.');

    const userData = { userID: user.id }
    const accessToken = jwt.sign(userData, ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    const refreshToken = crypto.randomBytes(40).toString('hex')
    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() + 7)

    try {
        const query = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`
        const values = [user.id, refreshToken, expireDate]
        await sendQuery(query, values)
    } catch  { res.status(500).send()  }

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
    }

    // send tokens as cookies
    res.cookie('accessToken', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, path: '/api/auth/refresh' })
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrfToken', csrfToken, cookieOptions);
    
    res.status(200).json({
        csrfToken: csrfToken
    });
})

router.get('/refresh', async (req, res) => {
    let { csrfToken, refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).send("No refresh token");

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (ACCESS_TOKEN_SECRET === undefined) {
        console.error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
        return res.status(500).send("Server configuration error.");
    }

    try {
        //make sure refresh token exists
        const query = `SELECT * FROM refresh_tokens WHERE token = $1 and expires_at > NOW()`;
        const result = (await sendQuery(query, [refreshToken])).rows;
        if (result.length === 0) return res.status(403).send("Invalid/Expired token");

        const user = result[0];
        const accessToken = jwt.sign({ userID: user.user_id }, ACCESS_TOKEN_SECRET, { expiresIn: '1m' }); //for testing

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' as const : 'lax' as const,
        }

        res.cookie('accessToken', accessToken, cookieOptions);

        if (!csrfToken) {
            csrfToken = crypto.randomBytes(32).toString('hex');
            res.cookie('csrfToken', csrfToken, cookieOptions);
        }

        res.status(201).json({ csrfToken })
    } catch {
        res.status(500).send("Internal Server Error")
    }

})

router.delete('/logout', async (req, res) => {
    const { refreshToken } = req.cookies

    try {
        const query = "DELETE FROM refresh_tokens WHERE token = $1";
        await sendQuery(query, [refreshToken])
    } catch {
        res.status(500).send("Internal Server Error")
    }

    const clearCookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
    }

    res.clearCookie('accessToken', clearCookieOptions)
    res.clearCookie('refreshToken', { 
        ...clearCookieOptions,
        path: '/api/auth/refresh' 
    })
    res.clearCookie('csrfToken', clearCookieOptions)

    res.status(200).send("Sucessfully logged out")
})

export default router