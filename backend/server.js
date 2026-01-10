import express from 'express'
import { Client } from 'pg'

const app = express()
const port = process.env.PORT || 3000;

const client = new Client()
await client.connect()
 

app.get('/', (req, res) => {
    res.send("DOCKER IFNLAL TESTING TESTING")
})

app.get('/testing', async (req, res) => {
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