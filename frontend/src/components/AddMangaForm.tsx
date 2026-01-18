import axios from 'axios'
import { useState } from 'react'

const url = `http://localhost:${import.meta.env.VITE_PORT|| 3000}`

interface AddMangaFormProps {
    closeModal: () => void
    onSuccess: () => void
}

export default function AddMangaForm({closeModal, onSuccess}: AddMangaFormProps) {
    const [errorMessage, setErrorMessage] = useState('')
    const [displayError, setDisplayError] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
            
        try {
            await axios.post(`${url}/addManga`, data)
            onSuccess();
            closeModal();
            setDisplayError(false);
            form.reset();
        } catch (err: any) {
            console.log(err)
            setErrorMessage(err.response.data.message);
            setDisplayError(true);
        }
    }

    return (
        <form method="post" onSubmit={handleSubmit} className="text-black flex flex-col gap-2">
            <label>
                Title:  <input name="title" className="border p-1 rounded-lg w-7/8"/>
            </label>
            <label>
                Status: <select name="status" className="border p-1 rounded-lg">
                    <option value="completed">Completed</option>
                    <option value="reading">Reading</option>
                    <option value="planned">Planned</option>
                    <option value="hold">Hold</option>
                </select>
            </label>
            <label>
                Image URL: <input name="imageurl" className="border p-1 rounded-lg w-60"
                placeholder="Leave empty for default..."/>
            </label>
            {displayError && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button type="submit" className="border p-1 rounded-lg hover:bg-black/5">Submit Form</button>
        </form>
    )
}