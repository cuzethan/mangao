import MangaCard from "./MangaCard"
import type { Manga } from "../config/constants"

interface MangaListProps {
    mangas: Manga[];
    refreshMangaList: () => void;
}

function MangaList({ mangas, refreshMangaList }: MangaListProps) {
    const mangaCards = mangas.map(manga => (
        <MangaCard key={manga.id} manga={manga} doOnDelete={refreshMangaList} />
    ))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mangaCards}
        </div>
    )
}

export default MangaList