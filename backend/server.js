import express from 'express'
import { Client } from 'pg'
import cors from 'cors'

const app = express()
const port = process.env.VITE_BACKEND_PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your actual Vite port
    methods: ['GET', 'POST'],
    credentials: true
}));

const client = new Client()
await client.connect()

app.get('/', (req, res) => {
    res.send("DOCKER IFNLAL TESTING TESTING")
})

app.get('/getMangaList', async (req, res) => {
    try {
        const query = 'SELECT * FROM mangas';
        const result = await client.query(query);
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/addManga', async (req, res) => {
    const { title, status, imageurl } = req.body;
    console.log(title, status, imageurl)
    if (!title) {
        return res.status(400).json({
            error: "Invalid Title",
            message: "Make sure you input a title."
        })
    }

    if (imageurl && !(imageurl.startsWith('data:image/') || imageurl.startsWith('http'))) {
        return res.status(400).json({ 
            error: "Invalid URL", 
            message: "Please provide a valid image link" 
        });
    }

    try {
        const query = "INSERT INTO mangas (title, status, imageurl) VALUES ($1, $2, $3)";
        const values = [title, status, imageurl || null]
        await client.query(query, values)
        res.status(201).send(`Recieved the data!`)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})