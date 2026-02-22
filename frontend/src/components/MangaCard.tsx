import api from "../config/api";
import { type Status, defaultImgUrl } from "../config/constants";


interface CardProps {
    title: string;
    status: Status;
    image_url: string;
    doOnDelete: () => void;
}

function MangaCard({ title, status, image_url, doOnDelete }: CardProps) {
    async function handleClick(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()

        try {
            const res = await api.delete(`mangas/deleteManga/${title}`);
            if (res.status === 201) doOnDelete() //// api status code, not manga status
        } catch (err: any) {
            console.log(err)
        }
    }

    return (
        <div className="border-white border-2 rounded-md p-4 flex justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="font-bbh text-3xl">{title}</h2>
                <img className="w-32 h-48 object-cover" src={image_url || defaultImgUrl} />
            </div>
            <div className="flex flex-col justify-between items-end font-nunito text-xl">
                <button onClick={handleClick} className="border-2 p-2 rounded-lg w-12 h-12 cursor-pointer hover:bg-gray-900">
                    <img src="src/assets/trash-can.svg" alt="trash" />
                </button>
                <p className="capitalize">
                    <span className="font-nunito-bold">Status:</span> {status}
                </p>
            </div>
        </div>
    )
}

export default MangaCard