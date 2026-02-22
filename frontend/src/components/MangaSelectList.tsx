import type { MangaDexManga } from '../config/constants'
import api from '../config/api'

interface MangaSelectCardProps {
    image_url: string,
    main_title: string,
    alt_title: string,
    authors: string[],
    mangadex_id: string,
    afterSelect: () => void
}

interface MangaSelectListProps {
    mangas: MangaDexManga[],
    closeModalAndRefresh: () => void
}

function MangaSelectCard({ image_url, main_title, alt_title, authors, mangadex_id, afterSelect }: MangaSelectCardProps) {

    async function handleSelect() {
        try {
            const res = await api.get(`test/getChapters/${mangadex_id}`);
            const chapters = res.data.sort((a: number, b: number) => a - b);
            const max_chapters = chapters.at(-1) || 1;

            const tracking = max_chapters ? true : false
            //tracking will be disabled if chapters don't exist

            const data = {
                image_url,
                last_checked: new Date(),
                max_chapters,
                status: "completed",
                title: main_title, //send only the main title
                tracking,
                mangadex_id
            };

            console.log(data)

            await api.post('mangas/addManga', data);
            afterSelect();
        } catch (err: any) {
            console.log(err);
        }
    }
    return (
        <button className="border-2 border-black p-1 rounded-lg cursor-pointer hover:bg-black/5 w-full min-w-xl max-w-2xl"
            onClick={handleSelect}>
            <div className="flex gap-3">
                <img className="w-24 h-32 object-cover shrink-0 rounded-md" src={image_url}></img>
                <div className="flex flex-col justify-center items-star text-left min-w-0">
                    <h1 className="text-3xl font-bold truncate w-full">{main_title}</h1>
                    <h1 className="text-2xl font-bold truncate w-full">{alt_title}</h1>
                    <h1 className="text-2xl text-gray-700 truncate w-full">By: {authors?.join(", ") || "Unknown"}</h1>
                </div>
            </div>
        </button>
    )
}

export default function MangaSelectList({ mangas, closeModalAndRefresh }: MangaSelectListProps) {
    return (
        <div>
            {mangas.length === 0 ? (
                <h1 className="text-2xl text-red-600">Manga does not exist on MangaDex or spelt incorrectly.</h1>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    {mangas.map((manga) => (
                        <div key={manga.mangadex_id}>
                            <MangaSelectCard
                                image_url={manga.image_url}
                                main_title={manga.main_title}
                                alt_title={manga.alt_title}
                                authors={manga.authors}
                                mangadex_id={manga.mangadex_id}
                                afterSelect={closeModalAndRefresh}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}