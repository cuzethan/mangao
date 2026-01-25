import express from 'express'
import { Client } from 'pg'

const router = express.Router()
const client = new Client()
await client.connect()

router.get('/getMangaList', async (req, res) => {
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

router.post('/addManga', async (req, res) => {
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
        if (err && typeof err === 'object' && 'code' in err) {
            if (err.code === '23505') { //indicate duplicate title
                res.status(403).send('Manga already exists in list!')
            }
        }
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/deleteManga/:title', async (req, res) => {
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

router.delete('/deleteManga/:title', async (req, res) => {
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

export default router