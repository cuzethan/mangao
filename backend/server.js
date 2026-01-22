import express from 'express'
import { Client } from 'pg'
import cors from 'cors'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
const port = process.env.PORT || 3000;

const client = new Client()
await client.connect()

let users = [] //use db to store user later 
let refreshTokens = [] //use db to store later

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send("mangao backend is running :)")
})

app.get('/getMangaList', async (req, res) => {
    const filters = req.query
    const activeFilters = []
    for (const [key, value] of Object.entries(filters)) {
        if (value === "true") activeFilters.push(`status = '${key}'`)
    }

    try {
        let query = 'SELECT * FROM mangas'
        if (activeFilters.length > 0) {
            const moreQuery = activeFilters.join(' OR ')
            query = query + " WHERE " + moreQuery
        }
        const result = await client.query(query);
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/addManga', async (req, res) => {
    const { title, status, imageurl } = req.body;
    if (!title) {
        return res.status(400).send('Make sure you input a title.');
    }

    if (imageurl && !(imageurl.startsWith('data:image/') || imageurl.startsWith('http'))) {
        return res.status(400).send('Please provide a valid image link.');
    }

    try {
        const query = "INSERT INTO mangas (title, status, imageurl) VALUES ($1, $2, $3)";
        const values = [title, status, imageurl || null]
        await client.query(query, values)
        res.status(201).send(`Recieved the data!`)
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { //indicate duplicate title
            res.status(403).send('Manga already exists in list!')
        }
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/deleteManga/:title', async (req, res) => {
    const title = req.params.title
    try {
        const query = "DELETE FROM mangas WHERE title = $1";
        await client.query(query, [title])
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }

    //validate deletion
    try {
        const query = "SELECT * FROM mangas WHERE title = 'asdf'";
        const data = await client.query(query)
        if (!data.rows[0]) res.status(201).send('Deletion Successful!');
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users', authenticateToken, (req, res) => { //verify through token header (no need for username in body)
    res.json(users.filter(user => user.username === req.user.username))
})

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await hash(req.body.password, 10) //10 is # of rounds for salt gen.
        const user = { username: req.body.username, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (user == null) {
        return res.status(400).send("Cannot find user")
    }
    try {
        if (await compare(req.body.password, user.password)) {
            const user = { username: req.body.username }
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
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

app.delete('/users/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
})

app.get('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status
        const accessToken = generateAccessToken({ username: user.username })
        res.json({ accessToken: accessToken })
    })
})

app.get('/users/test', (req, res) => {
    res.send(users)
});

app.get('/users/delete', (req, res) => {
    users = []
    res.status(200).send()
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user=user;
        next()
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m'}) 
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});