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
        query = query + " ORDER BY last_checked DESC"
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
        tracked_max_chapters,
        max_chapters,
        tracking,
        mangadex_id,
        tracking_enabled,
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
        let manga_id: number
        let query: string

        query = "SELECT * FROM mangas WHERE mangadex_id = $1" 
        let result = await sendQuery(query, [mangadex_id])

        if (!result.rows[0]) { //if manga doesn't exist in mangas table, add it a
            query = "INSERT INTO mangas (title, image_url, tracked_max_chapters, tracking_enabled, mangadex_id, last_checked) "
            + "VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
            const values = [title, image_url || null, tracked_max_chapters, tracking_enabled, mangadex_id || null, last_checked]
            const res = await sendQuery(query, values)
            manga_id = res.rows[0].id //grab manga id after adding to mangas table
        } else {
            manga_id = result.rows[0].id //grab manga id if it already exists in mangas table
        }


        query = "INSERT INTO user_manga_ref (user_id, manga_id, cur_chapter, status, tracking, max_chapters) VALUES ($1, $2, $3 , $4, $5, $6)"
        await sendQuery(query, [user_id, manga_id, 1, status, tracking, max_chapters])
        return res.status(201).send(`Recieved the data!`)
        
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/deleteManga', validateSession, async (req, res) => {
    const { manga_id, mangadex_id } = req.query
    const user_id = req.user?.userID;
    try {
        let query: string
        console.log(req.params)
        if (!mangadex_id) { //if untracked manga, delete from manga table
            query = "DELETE FROM mangas WHERE id = $1 RETURNING id";
            await sendQuery(query, [manga_id])
        }
        
        query = "DELETE FROM user_manga_ref WHERE user_id = $1 AND manga_id = $2"
        await sendQuery(query, [user_id, manga_id]);
        return res.status(200).send("Manga deleted successfully!");
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
});

router.patch('/editManga/:manga_id', validateSession, async (req, res) => {
    try {
        const data = req.body 
        const user_id = req.user?.userID;
        const manga_id = req.params.manga_id as string

        const clean = (obj: any) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, v]) => v != null) // Filters both null and undefined
            );
        };

        const mangaRefData = clean({
            status: data.status,
            cur_chapter: data.cur_chapter,
            tracking: data.tracking,
            max_chapters: data.max_chapters
        });

        const mangaData = clean({
            title: data.title,
            tracked_max_chapters: data.tracked_max_chapters,
        });

        const mangaRefKeys = Object.keys(mangaRefData) as (keyof typeof mangaRefData)[]
        const mangaKeys = Object.keys(mangaData) as (keyof typeof mangaData)[]

         if (mangaData.length === 0 && mangaRefData.length === 0) {
            return res.status(400).send("No fields provided for update.");
        }

        if (mangaRefKeys.length > 0) {
            const setClause = mangaRefKeys.map((key, index) => `${key} = $${index + 1}`).join(", ")
            const values = mangaRefKeys.map(key => mangaRefData[key]);
            const userIdIndex = mangaRefKeys.length + 1;
            const mangaIdIndex = mangaRefKeys.length + 2;
            values.push(user_id, manga_id);
            const query = `UPDATE user_manga_ref SET ${setClause} WHERE user_id = $${userIdIndex} AND manga_id = $${mangaIdIndex}`;
            await sendQuery(query, values);
        }

        if (mangaKeys.length > 0) {
            const setClause = mangaKeys.map((key, index) => `${key} = $${index + 1}`).join(", ")
            const values = mangaKeys.map(key => mangaData[key]);
            const mangaIdIndex = mangaKeys.length + 1;
            values.push(manga_id);
            const query = `UPDATE mangas SET ${setClause} WHERE id = $${mangaIdIndex}`;
            await sendQuery(query, values);
        }

        return res.status(200).send("Manga updated successfully!");
    } catch (err) { 
        console.log(err)
    }
});

export default router