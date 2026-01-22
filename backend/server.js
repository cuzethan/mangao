import express from 'express'
import { Client } from 'pg'
import cors from 'cors'
import { hash, compare } from 'bcrypt'
//import jwt from 'jsonwebtoken'

const app = express()
const port = process.env.PORT || 3000;

const client = new Client()
await client.connect()

let users = [] //use db to store user later 

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

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await hash(req.body.password, 10) //10 is # of rounds for salt gen.
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send("Cannot find user")
    }
    try {
        console.log(user)
        if (await compare(req.body.password, user.password)) {
            res.send("Success");
        } else {
            res.send('Login failed');
        } 
    } catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

app.get('/users/delete', (req, res) => {
    users = []
    res.status(200).send()
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});