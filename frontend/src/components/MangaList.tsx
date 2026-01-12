import MangaCard from "./MangaCard"

function MangaList({mangas}: {mangas: any[]}) {
    const mangaCards = mangas.map((manga, index) => (
        <MangaCard key={index} title={manga.title} status={manga.status} imgUrl={manga.imgUrl}/>
    ))

    return (
        <div className="flex flex-col gap-4">
            {mangaCards}    
        </div>
    )
}

export default MangaList