import { sendQuery } from "../config/db.js";
import axios from "axios";

const baseUrl = 'https://api.mangadex.org'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getMaxChapterFromMangaDex = async (mangadex_id: string) => {
    const result = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${mangadex_id}/aggregate?includeUnavailable=1`,
    });

    const volumes = result.data.volumes
    const numbers: number[] = []

    Object.values(volumes).forEach((volume: any) => {
        const chapters = volume.chapters;
        Object.keys(chapters).forEach((chapter: string) => {numbers.push(parseInt(chapter, 10))})
    })

    const finalChapterList = [...new Set(numbers)]
    finalChapterList.sort((a: number, b: number) => a - b)
    return finalChapterList.at(-1) || null
}

export const pullMangaUpdates = async () => {
    try {
        const res = await sendQuery(`SELECT id, tracked_max_chapters, mangadex_id, last_checked FROM mangas WHERE tracking_enabled = true`)
        const mangalistLength = res.rows.length
        for (const row of res.rows) {
            const mangaId = row.mangadex_id
            const maxChapter = await getMaxChapterFromMangaDex(mangaId)
            if (maxChapter && maxChapter > row.tracked_max_chapters) {
                await sendQuery(`UPDATE mangas SET tracked_max_chapters = $1, last_checked = $2 WHERE id = $3`, [maxChapter, new Date(), row.id])
                console.log(`Checked manga ${mangaId} for updates. Max chapter: ${maxChapter}`)
            }
            delay(6000) // 6 min delay per request
        }
    } catch (err) {
        console.log(err)
    }
}

export const updateUsersTrackingStatus = async () => {
    try {
        let query = "SELECT user_id, manga_id, tracked_max_chapters, max_chapters FROM mangas JOIN user_manga_ref"
        + " ON mangas.id = user_manga_ref.manga_id WHERE tracking_enabled = true"
        const res = await sendQuery(query)
        if (res.rows.length === 0) return;
        
        for (const row of res.rows) {
            const { user_id, manga_id, tracked_max_chapters, max_chapters } = row
            if (tracked_max_chapters !== max_chapters) {
                console.log(`Updating tracking status for user ${user_id} and manga ${manga_id}`)
                const query = `UPDATE user_manga_ref SET max_chapters = $1, manga_checked = $2 WHERE user_id = $3 AND manga_id = $4 AND tracking = true`
                await sendQuery(query, [tracked_max_chapters, true, user_id, manga_id])
            }
        }
    } catch (err) {
        console.log(err)
    }
}