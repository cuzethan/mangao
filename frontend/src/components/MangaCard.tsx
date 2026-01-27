import axios from "axios";

import { type Status, defaultImgUrl, baseURL } from "../constants";

const mangaURL = baseURL + "/mangas"

interface CardProps {
    title: string;
    status: Status;
    imageURL: string;
    doOnDelete: () => void;
}

function MangaCard({title, status, imageURL, doOnDelete}: CardProps) {
    async function handleClick (e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()
        
        try {
            const res = await axios.delete(`${mangaURL}/deleteManga/${title}`)
            if (res.status === 201) { // api status code, not manga status
                doOnDelete()
            }
        } catch (err: any) {
            console.log(err)
        }
    }
    
    return (
        <div className="border-white border-2 rounded-md p-4 flex justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="font-bbh text-3xl">{title}</h2>
                <img className="w-32 h-48 object-cover" src={imageURL || defaultImgUrl}/>
            </div>
            <div className="flex flex-col justify-between items-end font-nunito text-xl">
                <button onClick={handleClick} className="border-2 p-2 rounded-lg w-12 h-12 hover:bg-gray-900">
                    <img src="src/assets/trash-can.svg" alt="trash"/>
                </button>
                <p className="capitalize">
                    <span className="font-nunito-bold">Status:</span> {status}
                </p>
            </div>
        </div>
    )
}

export default MangaCard