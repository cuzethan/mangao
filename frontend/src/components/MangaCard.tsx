type Status = "completed" | "reading" | "planned" | "hold";

interface CardProps {
    name: string;
    status: Status;
    imgUrl: string;
}

function MangaCard({name, status, imgUrl}: CardProps) {
    return (
        <div className="border-white border-2 rounded-md p-4 flex justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="font-bbh text-3xl">{name}</h2>
                <img className="w-32 h-48 object-cover" src={imgUrl}/>
            </div>
            <div className="flex flex-col justify-end font-nunito text-xl">
                <p>
                    <span className="font-nunito-bold">Status:</span> {status}
                </p>
            </div>
        </div>
    )
}

export default MangaCard