import axios from "axios";

import { type Status, defaultImgUrl } from "../constants";

interface CardProps {
    title: string;
    status: Status;
    imageURL: string;
}

function MangaCard({title, status, imageURL}: CardProps) {
    async function handleClick (e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()


        //call the data some
    }
    
    return (
        <div className="border-white border-2 rounded-md p-4 flex justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="font-bbh text-3xl">{title}</h2>
                <img className="w-32 h-48 object-cover" src={imageURL || defaultImgUrl}/>
            </div>
            <div className="flex flex-col justify-between items-end font-nunito text-xl">
                <button onClick={handleClick} className="border border-2 p-2 rounded-lg w-12 h-12 hover:bg-gray-900">
                    <img src="src/assets/trash-can.svg" alt="trash"/>
                </button>
                <p>
                    <span className="font-nunito-bold">Status:</span> {status}
                </p>
            </div>
        </div>
    )
}

export default MangaCard