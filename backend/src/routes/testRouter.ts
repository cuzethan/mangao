import express from 'express'
import axios from 'axios'
import { validateSession } from '../middleware/auth.ts'

const router = express.Router()

const baseUrl = 'https://api.mangadex.org';

router.get('/search/:title', validateSession, async (req, res) => {
    const title = req.params.title
    try {
        const result = await axios({
            method: 'GET',
            url: `${baseUrl}/manga`,
            params: {
                title: title,
                limit: 5,
                "order[relevance]": "desc", 
                "order[followedCount]": "desc", 
                "includes[]": ["cover_art", "author"]
            }
        });

        const data = result.data.data

        const topFiveManga = data.map((manga: any) => {
            const coverRelationship = manga.relationships.find((rel: {type: string}) => rel.type === "cover_art")
            const fileName = coverRelationship?.attributes?.fileName

            const authorRelationship = manga.relationships.filter((rel: {type: string}) => rel.type === "author")   
            const authors = authorRelationship.map((author: any) => author.attributes.name)

            return {
                mangadex_id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                image_url: fileName 
                    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` 
                    : null,
                authors
            }
        })
        res.status(200).json(topFiveManga)
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

router.get('/getChapters/:id', validateSession, async (req, res) => {
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