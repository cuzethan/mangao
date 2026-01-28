import express from 'express'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import CONFIG from '../config/env.ts'
import cookieParser from 'cookie-parser'

import { sendQuery } from '../config/db.ts'

import { authenticateToken } from '../middleware/auth.ts'
import type { AuthRequest, UserPayload } from '../middleware/auth.ts'

const router = express.Router()
router.use(cookieParser())

let users: { username: string, password: string }[] = [] //use db to store user later 
let refreshTokens: string[] = [] //use db to store later

function generateAccessToken(user: { username: string } ) {
    return jwt.sign(user, CONFIG.ACCESS_TOKEN_SECRET, { expiresIn: '1m' }) 
}

router.get('/users', authenticateToken, (req: AuthRequest, res) => { //verify through token header (no need for username in body)
    res.json(users.filter(user => user.username === req.user?.username))
})

router.get('/listUsers', async (req, res) => {
    const query = 'SELECT * FROM users';
    try {
        const result = await sendQuery(query);
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await hash(req.body.password, 10) //10 is # of rounds for salt gen.
        const query = "INSERT INTO users (username, password_hashed) VALUES ($1, $2)";
        const values = [req.body.username, hashedPassword]
        await sendQuery(query, values)
        res.status(201).json({
            username: values[0],
            password: values[1]
        })
    } catch (err) {
        //implement proper error catching from postgres with codes
        res.status(500).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (user == null) {
        return res.status(400).send("Cannot find user")
    }
    try {
        if (await compare(req.body.password, user.password)) {
            const user = { username: req.body.username }
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, CONFIG.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
            res.send('Login failed');
        } 
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

router.delete('/users/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

router.get('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, CONFIG.REFRESH_TOKEN_SECRET, {}, (err, user) => {
        if (err) return res.sendStatus(403);
        const payload = user as UserPayload
        const accessToken = generateAccessToken({ username: payload.username })
        res.json({ accessToken: accessToken })
    })
})

router.get('/users/test', (req, res) => {
    res.send(users)
});

router.get('/users/delete', (req, res) => {
    users = []
    res.status(200).send()
});

export default router