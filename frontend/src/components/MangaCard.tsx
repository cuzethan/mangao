import { useState } from "react";
import { type Manga, defaultImgUrl } from "../config/constants";
import Modal from './Modal'
import MangaEditForm from "./MangaEditForm";
 
interface CardProps {
    manga: Manga;
    refreshMangaList: () => void;
}

function MangaCard({ manga, refreshMangaList }: CardProps) {
    const [open, setOpen] = useState(false)

    async function handleMangaClick(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()
        setOpen(true)
    }

    return (
        <div className="md:text-2xl text-3xl font-bbh w-full">
            <button onClick={handleMangaClick}className="cursor-pointer hover:bg-gray-800 w-full">
                <div className="relative border-white border-2 rounded-md p-4 flex justify-between">
                    <h1 className="text-left absolute w-[calc(75%-25px)] truncate">{manga.title}</h1>
                    <div className="flex flex-col gap-2 min-w-1/3">
                        <h1 className="text-black text-left">.</h1>
                        <img className="w-40 h-60 object-cover" src={manga.image_url || defaultImgUrl} />
                    </div>
                    <div className="flex flex-col justify-center min-w-13">
                        <h2 className="font-bbh">CHAPTER: {manga.cur_chapter.toString()}</h2>
                    </div>
                    <div className="flex flex-col justify-between items-end font-nunito text-xl min-w-1/3">
                        <p className="capitalize">
                            <span className="font-nunito-bold">Status:</span> {manga.status}
                        </p>
                        {manga.mangadex_id && <p className="capitalize"> 
                            <span className="font-nunito-bold">Tracking {manga.tracking ? "enabled" : "disabled"}!</span>
                        </p>}
                    </div>
                </div>
            </button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <MangaEditForm open={open} manga={manga} doOnDelete={refreshMangaList} 
                doOnUpdate={() => {
                    refreshMangaList();
                    setOpen(false);
                }} />
            </Modal>
        </div>
    )
}

export default MangaCard