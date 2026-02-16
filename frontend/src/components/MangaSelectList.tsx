import type { MangaDexManga } from '../constants'

interface MangaSelectCardProps {
    imageurl: string,
    title: string,
    authors: string[]
}

function MangaSelectCard({imageurl, title, authors}: MangaSelectCardProps) {
    return (
        <button className="border-2 border-black p-1 rounded-lg cursor-pointer hover:bg-black/5 w-full min-w-xl max-w-2xl">
            <div className="flex gap-3">
                <img className="w-24 h-32 object-cover shrink-0 rounded-md" src={imageurl}></img>
                <div className="flex flex-col justify-center items-star text-left min-w-0">
                    <h1 className="text-3xl font-bold truncate w-full">{title}</h1>
                    <h1 className="text-2xl text-gray-700 truncate w-full">By: {authors?.join(", ") || "Unknown"}</h1>
                </div>
            </div>
        </button>
    )
}

export default function MangaSelectList({ mangas }: { mangas: MangaDexManga[]}) {
    return (
        <div>
            { mangas.length === 0 ? (
                <h1 className="text-2xl text-red-600">Manga does not exist on MangaDex or spelt incorrectly.</h1>
            ) : (
                <div className = "flex flex-col gap-3 w-full">
                    {mangas.map((manga) => (
                        <div key={manga.mangadex_id}>
                            <MangaSelectCard 
                                imageurl={manga.imageurl} 
                                title={manga.title} 
                                authors={manga.authors} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}