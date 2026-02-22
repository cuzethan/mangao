import { useState } from 'react'
import api from '../config/api'
import MangaSelectList from './MangaSelectList'
import type { MangaDexManga } from '../config/constants'

interface AddMangaAutoProps {
    closeModalAndRefresh: () => void
}

export default function AddMangaAuto({ closeModalAndRefresh }: AddMangaAutoProps) {
    const [mangaDexData, setMangaDexData] = useState<MangaDexManga[]>([])
    const [showRecs, setShowRecs] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        try {
            const result = await api.get(`test/search/${data.title}`);
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
                <div className="flex gap-2 items-center">
                    Title: <input name="title" className="border-2 border-black rounded-lg px-1" />
                    <button type="submit" className="border-2 border-black rounded-lg hover:bg-black/5 px-2 cursor-pointer">Search Manga</button>
                </div>
            </form>
            {showRecs && <MangaSelectList mangas={mangaDexData} closeModalAndRefresh={closeModalAndRefresh} />}
        </div>
    )
}