import express from 'express'
import { sendQuery } from '../config/db.ts'

import { validateSession } from '../middleware/auth.ts'

const router = express.Router()

router.get('/getMangaList/{:searchTerm}', validateSession, async (req, res) => {
    const filters = req.query
    const searchTerm = req.params.searchTerm
    const activeFilters = []
    const user_id = req.user?.userID

    for (const [key, value] of Object.entries(filters)) {
        if (value === "true") activeFilters.push(`status = '${key}'`)
    }

    try {
        let query = 'SELECT * FROM user_manga_ref JOIN mangas ON manga_id = mangas.id WHERE user_id = $1'
        if (activeFilters.length > 0) {
            const moreQuery = activeFilters.join(' OR ')
            query = query + " AND (" + moreQuery + ")"
        }
        if (searchTerm && searchTerm !== "") {
            query = query + " AND title ILIKE '%" + searchTerm + "%'"
        }
        const result = await sendQuery(query, [user_id]);
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/addManga', validateSession, async (req, res) => {
    const { title, 
        status, 
        image_url,
        max_chapters,
        tracking,
        mangadex_id,
        last_checked
    } = req.body;
    const user_id = req.user?.userID
    
    if (!title) return res.status(400).send('Make sure you input a title.');

    if (image_url && !(image_url.startsWith('data:image/') || image_url.startsWith('http'))) {
        return res.status(400).send('Please provide a valid image link.');
    }

    const isOnlyDigits = (str: string) => { return /^\d+(\.\d+)?$/.test(str) };

    if (!isOnlyDigits(max_chapters)) return res.status(400).send("Make sure the chapter number is valid. (ex. 123 or 35.5)")

    try {
        let query = "INSERT INTO mangas (title, status, image_url, max_chapters, tracking, mangadex_id, last_checked) "
        + "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";
        const values = [title, status, image_url || null, max_chapters, tracking, mangadex_id || null, last_checked]
        const result = await sendQuery(query, values)
        const manga_id = result.rows[0].id
        
        query = "INSERT INTO user_manga_ref (user_id, manga_id, cur_chapter) VALUES ($1, $2, $3)"
        await sendQuery(query, [user_id, manga_id, 0])
        res.status(201).send(`Recieved the data!`)
    } catch (err) {
        if (err && typeof err === 'object' && 'code' in err) {
            if (err.code === '23505') { //indicate duplicate title
                res.status(403).send('Manga already exists in list!')
            }
        }
        res.status(500).send(err);
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

router.patch('/editManga', validateSession, async (req, res) => {
    const { title, 
        status, 
        image_url,
        max_chapters,
        tracking,
        mangadex_id,
        last_checked
    } = req.body;

    const user_id = req.user?.userID
    
    if (!title) return res.status(400).send('Make sure you input a title.');

    if (image_url && !(image_url.startsWith('data:image/') || image_url.startsWith('http'))) {
        return res.status(400).send('Please provide a valid image link.');
    }

    const isOnlyDigits = (str: string) => { return /^\d+(\.\d+)?$/.test(str) };

    if (!isOnlyDigits(max_chapters)) return res.status(400).send("Make sure the chapter number is valid. (ex. 123 or 35.5)")

    try {
        let query = "INSERT INTO mangas (title, status, image_url, max_chapters, tracking, mangadex_id, last_checked) "
        + "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";
        const values = [title, status, image_url || null, max_chapters, tracking, mangadex_id || null, last_checked]
        const result = await sendQuery(query, values)
        const manga_id = result.rows[0].id
        
        query = "INSERT INTO user_manga_ref (user_id, manga_id, cur_chapter) VALUES ($1, $2, $3)"
        await sendQuery(query, [user_id, manga_id, 0])
        res.status(201).send(`Recieved the data!`)
    } catch (err) {
        if (err && typeof err === 'object' && 'code' in err) {
            if (err.code === '23505') { //indicate duplicate title
                res.status(403).send('Manga already exists in list!')
            }
        }
        res.status(500).send(err);
    }
});

export default router