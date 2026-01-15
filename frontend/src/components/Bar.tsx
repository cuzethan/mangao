import { useState } from 'react'
import Modal from './Modal'
import AddMangaForm from './AddMangaForm'

interface FilterState {
    completed: boolean,
    reading: boolean,
    planned: boolean,
    hold: boolean
}

interface BarProps {
    filters: FilterState;
    onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Bar({filters, onFilterChange}: BarProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className="font-nunito my-4 flex gap-4 items-center">
            <form className="border-solid border-2 border-white rounded-md p-2">
                <input type="text" placeholder="Search..." className="focus:outline-none"/>
            </form>
            <label className="flex gap-2">
                <input type="checkbox" name="completed" 
                checked={filters.completed} onChange={onFilterChange}/> Completed
                <input type="checkbox" name="reading"
                checked={filters.reading} onChange={onFilterChange}/> Reading
                <input type="checkbox" name="planned"
                checked={filters.planned} onChange={onFilterChange} /> Planned 
                <input type="checkbox" name="hold"
                checked={filters.hold} onChange={onFilterChange}/> Hold
            </label>
            <button type="button" className="text-white hover:bg-gray-900 border-solid border-2 border-white rounded-md p-2 ml-auto"
            onClick={() => setOpen(true)}>
                ADD MANGA
            </button>
            <Modal open={open} onClose = {() => setOpen(false)}>
                <AddMangaForm closeModal={() => setOpen(false)}/>
            </Modal>
        </div>
    )
}