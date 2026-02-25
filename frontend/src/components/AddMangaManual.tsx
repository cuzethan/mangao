import { useState } from 'react'
import api from '../config/api'

interface AddMangaManualProps {
    onAddingManga: () => void
}

export default function AddMangaManual({ onAddingManga }: AddMangaManualProps) {
    const [errorMessage, setErrorMessage] = useState('')
    const [displayError, setDisplayError] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        const processedData = {
            ...data,
            tracking: false,
            last_checked: new Date()
        }

        try {
            await api.post('mangas/addManga', processedData);
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
                <div className="flex items-center gap-2">
                    Title:  
                    <input name="title" className="border-2 border-black p-1 rounded-lg grow"></input>
                </div>
            </label>
            <label className="flex gap-2 items-center">
                Status: <select name="status" className="border-2 border-black p-1 rounded-lg">
                    <option value="completed">Completed</option>
                    <option value="reading">Reading</option>
                    <option value="planned">Planned</option>
                    <option value="hold">Hold</option>
                </select>
                # of Chapters:  <input name="max_chapters" className="border-2 border-black p-1 rounded-lg max-w-15 px-1" />
            </label>
            <label>
                Image URL: <input name="image_url" className="border-2 border-black p-1 rounded-lg px-1"
                    placeholder="Leave empty for default..." />
            </label>
            {displayError && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button type="submit" className="border-2 border-black p-1 rounded-lg hover:bg-black/5 cursor-pointer px-1">Submit Form</button>
        </form>
    )
}