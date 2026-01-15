interface AddMangaFormProps {
    closeModal: () => void
}

export default function AddMangaForm({closeModal}: AddMangaFormProps) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("Works")
        closeModal()
    }
    
    return (
        <form method="post" onSubmit={handleSubmit} className="text-black flex flex-col gap-2">
            <label>
                Title:  <input name="titleInput" className="border p-1 rounded-lg w-7/8"/>
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
                Image URL: <input name="imgURLInput" className="border p-1 rounded-lg w-60"/>
            </label>
            <button type="submit" className="border p-1 rounded-lg">Submit Form</button>
        </form>
    )
}