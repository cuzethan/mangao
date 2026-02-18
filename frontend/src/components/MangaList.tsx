import MangaCard from "./MangaCard"
import type { Manga } from "../constants"

interface MangaListProps {
    mangas: Manga[];
    refreshMangaList: () => void;
}

function MangaList({mangas, refreshMangaList}: MangaListProps) {
    const mangaCards = mangas.map(manga => (
        <MangaCard key={manga.id} title={manga.title} status={manga.status} 
        image_url={manga.image_url} doOnDelete={refreshMangaList}/>
    ))

    return (
        <div className="flex flex-col gap-4">
            {mangaCards}    
        </div>
    )
}

export default MangaList