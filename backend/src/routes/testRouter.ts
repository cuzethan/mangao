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

            const altTitleList: {en: string}[] = manga.attributes.altTitles
            const default_title = Object.values(manga.attributes.title)[0] as string

            const main_title = altTitleList.find(obj => obj.hasOwnProperty("en"))?.en //english title
            const alt_title = (main_title && default_title !== main_title) ? "Alt: " + default_title : null //if english title exists, set alt title, else null
                
            return {
                mangadex_id: manga.id,
                main_title: main_title || default_title, //if no english title, set default title
                alt_title: alt_title,
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
    const numbers: number[] = []

    Object.values(volumes).forEach((volume: any) => {
        const chapters = volume.chapters;
        Object.keys(chapters).forEach((chapter: string) => {numbers.push(parseInt(chapter, 10))})
    })

    const finalChapterList = [...new Set(numbers)]
    finalChapterList.sort((a: number, b: number) => a - b)
    res.send(finalChapterList)
})

export default router