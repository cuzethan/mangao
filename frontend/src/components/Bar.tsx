import { useState } from 'react'
import Modal from './Modal'
import AddMangaManual from './AddMangaManual'
import AddMangaAuto from './AddMangaAuto'
import AddTypeChoose from './AddTypeChoose'

interface FilterState {
    completed: boolean,
    reading: boolean,
    planned: boolean,
    hold: boolean
}

interface BarProps {
    filters: FilterState;
    onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onMangaAdded: () => void;
}

export default function Bar({filters, onFilterChange, onMangaAdded}: BarProps) {
    const [open, setOpen] = useState(false);
    const [showButtons, setShowButtons] = useState(true);
    const [showManualForm, setManualForm] = useState(false);
    const [showAutoForm, setAutoForm] = useState(false);
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
    } 

    function handleClose() {
        setOpen(false);
        setManualForm(false);
        setAutoForm(false);
        setShowButtons(true);
    }

    return (
        <div className="font-nunito my-4 flex gap-4 items-center text-2xl">
            <form onSubmit={handleSubmit} className="border-solid border-2 border-white rounded-md p-2">
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
            <button type="button" className="text-white hover:bg-gray-900 border-solid border-2 border-white rounded-md p-2 ml-auto cursor-pointer"
            onClick={() => setOpen(true)}>
                ADD MANGA
            </button>
            <Modal open={open} onClose={() => handleClose()}>
                {showButtons && <AddTypeChoose hideButton={() => setShowButtons(false)} showAuto={() => setAutoForm(true)}
                showManual={() => setManualForm(true)}/>}
                {showManualForm && <AddMangaManual closeModal={() => handleClose()} onSuccess={onMangaAdded}/>}
                {showAutoForm && <AddMangaAuto/>}
            </Modal>
        </div>
    )
}