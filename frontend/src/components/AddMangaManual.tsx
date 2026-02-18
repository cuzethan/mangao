import axios from 'axios'
import { useState } from 'react'
import { baseURL } from '../constants'

const mangaURL = baseURL + "/mangas"

interface AddMangaManualProps  {
    onAddingManga: () => void
}

export default function AddMangaManual({onAddingManga}: AddMangaManualProps) {
    const [errorMessage, setErrorMessage] = useState('')
    const [displayError, setDisplayError] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const csrfToken = document.cookie.split('=')[1]
            
        try {
            await axios.post(`${mangaURL}/addManga`, 
                data,
                {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken
                    }
                }
            )
            onAddingManga();
            setDisplayError(false);
            form.reset();
        } catch (err: any) {
            setErrorMessage(err.response.data);
            setDisplayError(true);
        }
    }

    return (
        <form method="post" onSubmit={handleSubmit} className="text-black flex flex-col gap-2">
            <label>
                Title:  <input name="title" className="border-2 border-black p-1 rounded-lg w-full"/>
            </label>
            <label>
                Status: <select name="status" className="border-2 border-black p-1 rounded-lg">
                    <option value="completed">Completed</option>
                    <option value="reading">Reading</option>
                    <option value="planned">Planned</option>
                    <option value="hold">Hold</option>
                </select>
            </label>
            <label>
                Image URL: <input name="imageurl" className="border-2 border-black p-1 rounded-lg"
                placeholder="Leave empty for default..."/>
            </label>
            {displayError && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button type="submit" className="border-2 border-black p-1 rounded-lg hover:bg-black/5">Submit Form</button>
        </form>
    )
}