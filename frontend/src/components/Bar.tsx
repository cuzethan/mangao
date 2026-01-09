import { useState } from 'react'
import Modal from './Modal'

export default function Bar() {
    const [open, setOpen] = useState(false)
    return (
        <div className="font-nunito my-4 flex gap-4 items-center">
            <form className="border-solid border-2 border-white rounded-md p-2">
                <input type="text" placeholder="Search..." className="focus:outline-none"/>
            </form>
            <label className="flex gap-2">
                <input type="checkbox" /> Completed
                <input type="checkbox" /> Reading
                <input type="checkbox" /> Test 
            </label>
            <button type="button" className="text-white hover:bg-gray-900 border-solid border-2 border-white rounded-md p-2 ml-auto"
            onClick={() => setOpen(true)}>
                ADD MANGA
            </button>
            <Modal open={open} onClose = {() => setOpen(false)}>
                <h1 className ="text-black">HI</h1>
            </Modal>
        </div>
    )
}