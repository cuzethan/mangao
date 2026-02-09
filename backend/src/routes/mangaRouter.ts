import express from 'express'
import { sendQuery } from '../config/db.ts'

import { validateSession } from '../middleware/auth.ts'

const router = express.Router()

router.get('/getMangaList', validateSession, async (req, res) => {
    const filters = req.query
    const activeFilters = []
    const user_id = req.user?.userID

    for (const [key, value] of Object.entries(filters)) {
        if (value === "true") activeFilters.push(`status = '${key}'`)
    }

    try {
        let query = 'SELECT user_manga_ref.id, mangas.title, mangas.status, mangas.imageurl FROM ' +
        'user_manga_ref JOIN mangas ON manga_id = mangas.id WHERE user_id = $1'
        if (activeFilters.length > 0) {
            const moreQuery = activeFilters.join(' OR ')
            query = query + " AND (" + moreQuery + ")"
        }
        const result = await sendQuery(query, [user_id]);
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/addManga', validateSession, async (req, res) => {
    const { title, status, imageurl } = req.body;
    const user_id = req.user?.userID

    if (!title) {
        return res.status(400).send('Make sure you input a title.');
    }

    if (imageurl && !(imageurl.startsWith('data:image/') || imageurl.startsWith('http'))) {
        return res.status(400).send('Please provide a valid image link.');
    }

    try {
        let query = "INSERT INTO mangas (title, status, imageurl) VALUES ($1, $2, $3) RETURNING id";
        const values = [title, status, imageurl || null]
        const result = await sendQuery(query, values)
        const manga_id = result.rows[0].id

        query = "INSERT INTO user_manga_ref (user_id, manga_id) VALUES ($1, $2)"
        await sendQuery(query, [user_id, manga_id])
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

router.delete('/deleteManga/:title', validateSession, async (req, res) => {
    const title = req.params.title;
    const user_id = req.user?.userID;

    try {
        let query = "DELETE FROM mangas WHERE title = $1 RETURNING id";
        const result = await sendQuery(query, [title])
        const manga_id = result.rows[0].id
        
        query = "DELETE FROM user_manga_ref WHERE user_id = $1 AND manga_id = $2"
        await sendQuery(query, [user_id, manga_id])
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }

    //validate deletion
    try {
        const query = "SELECT * FROM mangas WHERE title = $1";
        const data = await sendQuery(query, [title])
        if (!data.rows[0]) res.status(201).send('Deletion Successful!');
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
});

export default router