import axios from 'axios'
import { useState } from 'react'
import { baseURL } from '../constants'

interface AddMangaAutoProps {
    closeModal: () => void
    onSuccess: () => void
}

const testURL = baseURL + "/test"

export default function AddMangaAuto() {

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const csrfToken = document.cookie.split('=')[1]
    
        try {
            const result = await axios.get(`${testURL}/search/${data.title}`, 
                {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken
                    }
                }
            )
            console.log(result.data)
            form.reset();
        } catch (err: any) {
            console.log("BROKE")
        }
    }

    return (
        <div className="text-black">
            <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div>
                    Title: <input name="title" className="border-2 border-black rounded-lg gap-2"/>
                </div>
                <button type="submit" className="border-2 border-black p-1 rounded-lg hover:bg-black/5">Search Manga</button>
            </form>
        </div>
    )
}