import type { MangaDexManga } from '../constants'
import axios from 'axios'
import { baseURL } from '../constants'

interface MangaSelectCardProps {
    image_url: string,
    title: string,
    authors: string[]
    onSelect: () => void
}

interface MangaSelectListProps {
    mangas: MangaDexManga[],
    closeModalAndRefresh: () => void
}

function MangaSelectCard({image_url, title, authors, onSelect}: MangaSelectCardProps) {
    const mangaURL = baseURL + "/manga"
    
    async function handleSelect() {
        const csrfToken = document.cookie.split('=')[1]
            
        /*try {
            await axios.post(`${mangaURL}/addManga`, 
                data,
                {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken
                    }
                }
            )
            onAddingManga();
            setDisplayError(false);
            form.reset();
        } catch (err: any) {
            setErrorMessage(err.response.data);
            setDisplayError(true);
        }*/
    }
    return (
        <button className="border-2 border-black p-1 rounded-lg cursor-pointer hover:bg-black/5 w-full min-w-xl max-w-2xl"
        onClick={handleSelect}>
            <div className="flex gap-3">
                <img className="w-24 h-32 object-cover shrink-0 rounded-md" src={image_url}></img>
                <div className="flex flex-col justify-center items-star text-left min-w-0">
                    <h1 className="text-3xl font-bold truncate w-full">{title}</h1>
                    <h1 className="text-2xl text-gray-700 truncate w-full">By: {authors?.join(", ") || "Unknown"}</h1>
                </div>
            </div>
        </button>
    )
}

export default function MangaSelectList({mangas, closeModalAndRefresh}: MangaSelectListProps) {
    return (
        <div>
            { mangas.length === 0 ? (
                <h1 className="text-2xl text-red-600">Manga does not exist on MangaDex or spelt incorrectly.</h1>
            ) : (
                <div className = "flex flex-col gap-3 w-full">
                    {mangas.map((manga) => (
                        <div key={manga.mangadex_id}>
                            <MangaSelectCard 
                                image_url={manga.image_url} 
                                title={manga.title} 
                                authors={manga.authors} 
                                onSelect={closeModalAndRefresh}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}