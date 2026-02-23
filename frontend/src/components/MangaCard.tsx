import { useState } from "react";
import api from "../config/api";
import { type Manga, defaultImgUrl } from "../config/constants";
import Modal from './Modal'
 
interface CardProps {
    manga: Manga;
    doOnDelete: () => void;
}

function MangaCard({ manga, doOnDelete }: CardProps) {
    const [open, setOpen] = useState(false)

    async function handleMangaClick(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()
        setOpen(true)
    }

    async function handleDeleteClick(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()

        try {
            const res = await api.delete(`mangas/deleteManga/${manga.title}`);
            if (res.status === 201) doOnDelete() //// api status code
        } catch (err: any) {
            console.log(err)
        }
    }

    return (
        <button onClick={handleMangaClick}className="cursor-pointer hover:bg-gray-950">
            <div className="border-white border-2 rounded-md p-4 flex justify-between">
                <div className="flex flex-col gap-2 min-w-1/3">
                    <h2 className="font-bbh text-4xl flex">{manga.title}</h2>
                    <img className="w-40 h-60 object-cover" src={manga.image_url || defaultImgUrl} />
                </div>
                <div className="flex flex-col justify-center min-w-13">
                    <h2 className="font-bbh text-4xl">CHAPTER: {manga.cur_chapter.toString()}</h2>
                </div>
                <div className="flex flex-col justify-between items-end font-nunito text-xl min-w-1/3">
                    <button onClick={handleDeleteClick} className="border-2 p-2 rounded-lg w-12 h-12 cursor-pointer hover:bg-gray-900">
                        <img src="src/assets/trash-can.svg" alt="trash" />
                    </button>
                    <p className="capitalize text-3xl">
                        <span className="font-nunito-bold">Status:</span> {manga.status}
                    </p>
                </div>
            </div>
        </button>
    )
}

export default MangaCard