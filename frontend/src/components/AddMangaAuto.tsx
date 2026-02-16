import axios from 'axios'
import { useState } from 'react'
import { baseURL } from '../constants'
import MangaSelectList from './MangaSelectList'
import type { MangaDexManga } from '../constants'

const testURL = baseURL + "/test"

export default function AddMangaAuto() {
    const [mangaDexData, setMangaDexData] = useState<MangaDexManga[]>([])
    const [showRecs, setShowRecs] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const csrfToken = document.cookie.split('=')[1]
    
        try {
            const result = await axios.get(`${testURL}/search/${data.title}`, 
                {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken
                    }
                }
            )
            console.log(result.data)
            setMangaDexData(result.data)
            setShowRecs(true)
            form.reset();
        } catch (err: any) {
            setShowRecs(false)
            console.log("BROKE")
        }
    }

    return (
        <div className="text-black flex flex-col gap-3">
            <form method="post" onSubmit={handleSubmit}>
                <div className="flex gap-2">
                    Title: <input name="title" className="border-2 border-black rounded-lg"/>
                    <button type="submit" className="border-2 border-black rounded-lg hover:bg-black/5">Search Manga</button>
                </div>
            </form>
            {showRecs && <MangaSelectList mangas={mangaDexData}/>}
        </div>
    )
}