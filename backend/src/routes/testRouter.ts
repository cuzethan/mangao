import express from 'express'
import axios from 'axios'

const router = express.Router()

const baseUrl = 'https://api.mangadex.org';

router.get('/:title', async (req, res) => {
    const title = req.params.title
    const result = await axios({
        method: 'GET',
        url: `${baseUrl}/manga`,
        params: {
            title: title,
            limit: 5,
            "order[followedCount]": "desc"
        }
    });

    const data = result.data.data

    const topFiveManga = data.map((manga: any) => ({
        mangadex_id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0]
    }))
    res.send(data)
})

router.get('/manga/:id', async (req, res) => {
    const mangadex_id = req.params.id
    const result = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${mangadex_id}/aggregate?includeUnavailable=1`,
    });

    const volumes = result.data.volumes
    const numbers: string[] = []

    Object.values(volumes).forEach((volume: any) => {
        const chapters = volume.chapters;
        Object.keys(chapters).forEach((chapter: string) => {numbers.push(chapter)})
    })
    res.send(numbers)
})

export default router