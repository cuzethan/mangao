import express from 'express'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import CONFIG from '../config/env.ts'
import cookieParser from 'cookie-parser'
import crypto from 'crypto'

import { sendQuery } from '../config/db.ts'

const router = express.Router()
router.use(cookieParser())

/* router.get('/users', authenticateToken, (req: AuthRequest, res) => { //verify through token header (no need for username in body)
    res.json(users.filter(user => user.username === req.user?.username))
}) */

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
        const username = req.body.username;
        const hashedPassword = await hash(req.body.password, 10) //10 is # of rounds for salt gen.
        const query = "INSERT INTO users (username, password_hashed) VALUES ($1, $2)";
        const values = [username, hashedPassword]
        await sendQuery(query, values);
        res.status(201).json({
            username: values[0],
            password: values[1]
        })
    } catch (err) {
        //implement proper error catching from postgres with codes
        res.status(500).send(err)
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const query = `SELECT * FROM users WHERE username = $1`
    const user = (await sendQuery(query, [username])).rows[0]
    console.log(user)
    if (user == null) {
        return res.status(400).send("Cannot find user")
    }
    if (await compare(password, user.password_hashed)) {
        const userData = { userID: user.id }
        const accessToken = jwt.sign(userData, CONFIG.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = crypto.randomBytes(40).toString('hex')
        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + 7)
        try {
            const query = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`
            const values = [user.id, refreshToken, expireDate]
            await sendQuery(query, values)
        } catch (err) {
            console.log(err)
            res.status(500).send()
        }
        // send tokens as cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'lax'})
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/refresh' })
        const csrfToken = crypto.randomBytes(32).toString('hex');
        res.cookie('csrfToken', csrfToken, { secure: true, sameSite: 'lax' });

        res.json({ message: "Logged in", user: user.username });
    } else {
        res.send('Login failed');
    }
})

router.get('/refresh', async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).send("No refresh token");

    try {
        const query = `SELECT * FROM refresh_tokens WHERE token = $1 and expires_at > NOW()`;
        const result = (await sendQuery(query, [refreshToken])).rows;
        if (result.length === 0) res.status(403).send("Invalid/Expired token");

        const user = result[0];
        const accessToken = jwt.sign({ userID: user.id }, CONFIG.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'lax'});
    } catch (err) {
        res.send(err)
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
    
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.clearCookie('csrfToken')

    res.status(200).send("Sucessfully logged out")
})

export default router