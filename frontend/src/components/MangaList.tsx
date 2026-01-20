import MangaCard from "./MangaCard"

interface MangaListProps {
    mangas: any[];
    onMangaDelete: () => void;
}

function MangaList({mangas, onMangaDelete}: MangaListProps) {
    const mangaCards = mangas.map(manga => (
        <MangaCard key={manga.title} title={manga.title} status={manga.status} 
        imageURL={manga.imageurl} doOnDelete={onMangaDelete}/>
    ))

    return (
        <div className="flex flex-col gap-4">
            {mangaCards}    
        </div>
    )
}

export default MangaList