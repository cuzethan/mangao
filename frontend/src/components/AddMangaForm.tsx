import axios from 'axios'

const url = `http://localhost:${import.meta.env.VITE_PORT|| 3000}`

interface AddMangaFormProps {
    closeModal: () => void
}


export default function AddMangaForm({closeModal}: AddMangaFormProps) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        axios.post(`${url}/addManga`, data)
        .then(res => console.log(res))
        .catch(err => console.log(err))

        closeModal()
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
            <button type="submit" className="border p-1 rounded-lg hover:bg-black/5">Submit Form</button>
        </form>
    )
}