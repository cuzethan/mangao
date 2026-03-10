import type { MangaDexManga } from '../config/constants'
import api from '../config/api'
import { useState } from 'react'

interface MangaSelectCardProps {
    image_url: string,
    main_title: string,
    alt_title: string,
    authors: string[],
    mangadex_id: string,
    afterSelect: () => void
    setMangaAlreadyExists: (exists: boolean) => void
}

interface MangaSelectListProps {
    mangas: MangaDexManga[],
    closeModalAndRefresh: () => void
}

function MangaSelectCard({ image_url, main_title, alt_title, authors, mangadex_id, afterSelect, setMangaAlreadyExists }: MangaSelectCardProps) {
    async function handleSelect() {
        try {
            const res = await api.get(`test/getMaxChapter/${mangadex_id}`);
            const max_chapters = res.data

            let tracking;
            let tracking_enabled

            if (!max_chapters || max_chapters === 0) {
                tracking = false
                tracking_enabled = false
            } else {
                tracking = true
                tracking_enabled = true
            }

            const data = {
                image_url,
                last_checked: new Date(),
                tracked_max_chapters: max_chapters,
                max_chapters,
                status: "planned",
                title: main_title, //send only the main title
                tracking,
                mangadex_id,
                tracking_enabled,
            };

            await api.post('mangas/addManga', data);
            setMangaAlreadyExists(false)
            afterSelect();
        } catch (err: any) {
            setMangaAlreadyExists(true)
            console.log(err);
        }
    }
    return (
        <button className="border-2 border-black p-1 rounded-lg cursor-pointer hover:bg-black/5 max-w-full w-full"
            onClick={handleSelect}>
            <div className="flex gap-3 w-full">
                <img className="w-24 h-32 object-cover shrink-0 rounded-md" src={image_url}></img>
                <div className="flex flex-col justify-center items-start text-left flex-1 min-w-0 max-w-full overflow-hidden">
                    <h1 className="text-3xl font-bold truncate w-full">{main_title}</h1>
                    <h1 className="text-2xl font-bold truncate w-full">{alt_title}</h1>
                    <h1 className="text-2xl text-gray-700 truncate w-full">By: {authors?.join(", ") || "Unknown"}</h1>
                </div>
            </div>
        </button>
    )
}

export default function MangaSelectList({ mangas, closeModalAndRefresh }: MangaSelectListProps) {
    const [mangaAlreadyExists, setMangaAlreadyExists] = useState(false)

    return (
        <div className="max-h-[75vh] overflow-y-auto pr-2">
            {mangas.length === 0 ? (
                <h1 className="text-2xl text-red-600">Manga does not exist on MangaDex or spelt incorrectly.</h1>
            ) : (
                <div className="flex flex-col gap-3 max-w-fit">
                    {mangaAlreadyExists && (
                        <h1 className="text-2xl text-red-600">Manga already exists in your list.</h1>
                    )} 
                    {mangas.map((manga) => (
                    <div key={manga.mangadex_id}>
                        <MangaSelectCard
                            image_url={manga.image_url}
                            main_title={manga.main_title}
                            alt_title={manga.alt_title}
                            authors={manga.authors}
                            mangadex_id={manga.mangadex_id}
                            afterSelect={closeModalAndRefresh}
                            setMangaAlreadyExists={setMangaAlreadyExists}
                        />
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
}