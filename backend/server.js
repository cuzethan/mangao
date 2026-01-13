import express from 'express'
import { Client } from 'pg'
import cors from 'cors'

const app = express()
const port = process.env.VITE_BACKEND_PORT || 3000;
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})