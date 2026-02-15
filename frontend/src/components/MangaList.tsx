import MangaCard from "./MangaCard"
import type { Manga } from "../constants"

interface MangaListProps {
    mangas: Manga[];
    onMangaDelete: () => void;
}

function MangaList({mangas, onMangaDelete}: MangaListProps) {
    const mangaCards = mangas.map(manga => (
        <MangaCard key={manga.id} title={manga.title} status={manga.status} 
        imageURL={manga.imageurl} doOnDelete={onMangaDelete}/>
    ))

    return (
        <div className="flex flex-col gap-4">
            {mangaCards}    
        </div>
    )
}

export default MangaList