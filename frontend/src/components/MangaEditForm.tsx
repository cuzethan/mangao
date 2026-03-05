import { useEffect, useState } from 'react';
import { type Manga, type Status } from '../config/constants';
import api from '../config/api';

interface MangaEditFormProps {
    manga: Manga
    open: boolean
    doOnDelete: () => void
    doOnUpdate: () => void
}

export default function MangaEditForm({manga, open, doOnDelete, doOnUpdate}: MangaEditFormProps) {
    const [status, setStatus] = useState<string>(manga.status);
    const [title, setTitle] = useState<string>(manga.title)
    const [cur_chapter, setCurChapter] = useState<number | "">(manga.cur_chapter)
    const [max_chapters, setMaxChapters] = useState<number | "">(manga.max_chapters)

    const tracking = manga.tracking;
    const tracking_enabled = manga.tracking_enabled;

    function grabAlteredData(data: Manga) {
        const alteredData: Partial<Manga> = {}
        
        if (data.title && data.title !== manga.title) alteredData.title = data.title;
        if (data.status !== manga.status) alteredData.status = data.status;
        if (Number(data.cur_chapter)!== manga.cur_chapter) alteredData.cur_chapter = data.cur_chapter;
        if (Number(data.max_chapters) !== manga.max_chapters) alteredData.max_chapters = data.max_chapters;

        if (Number(data.max_chapters) === 1) alteredData.max_chapters = 1
        return alteredData;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget;

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        const alteredData = grabAlteredData(data as any)
        
        //if tracking is possbile (by tracking_enabled), and max_chapters changed
        if (manga.tracking_enabled && "max_chapters" in alteredData) { 
            if (alteredData.max_chapters === 1) { // if set to 1, make tracking work
                alteredData.max_chapters = manga.tracked_max_chapters;
                alteredData.last_checked = new Date();
                if (!tracking) alteredData.tracking = true; 
            } else {
                //max_chapters is changed (implicit), and tracking is on, turn tracking off
                if (tracking) alteredData.tracking = false;
            }
        }

        if (manga.manga_checked) alteredData.manga_checked = false;

        try {
            await api.patch(`mangas/editManga/${manga.id}`, alteredData);
            doOnUpdate();
        } catch (err: any) {
            console.log(err)
        }
    }

    async function handleDeleteClick(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault()

        try {
            const params = {
                manga_id: manga.id,
                mangadex_id: manga.mangadex_id
            }
            await api.delete(`mangas/deleteManga`, { params });
            doOnDelete() 
        } catch (err: any) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (open) { // force the dropdown to match the manga whenever the modal opens
            setStatus(manga.status); 
            setTitle(manga.title);
            setCurChapter(manga.cur_chapter);
            setMaxChapters(manga.max_chapters);
        }
    }, [open]);

    return (
        <div className="font-nunito text-2xl text-black gap-3">
            <form method="post" onSubmit={handleSubmit} className="text-black flex flex-col gap-2">
                <label>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">Title: </span>  
                        <input name="title" className="border-2 border-black p-1 rounded-lg grow" 
                        value={title} disabled={!!manga.mangadex_id} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                </label>
                <label className="flex gap-2 items-center onHover">
                    <span className="font-bold">Status: </span> 
                    <select 
                        name="status" 
                        className="border-2 border-black p-1 rounded-lg hover:bg-black/5"
                        value={status} 
                        onChange={(e) => setStatus(e.target.value as Status)}
                    >
                        <option value="completed">Completed</option>
                        <option value="reading">Reading</option>
                        <option value="planned">Planned</option>
                        <option value="hold">Hold</option>
                    </select>
                    <span className="font-bold">Cur Chapter: </span> 
                    <input 
                        type="text"
                        name="cur_chapter"
                        value={cur_chapter}
                        onChange={(e) => {
                            let val: number | '' = parseInt(e.target.value)
                            if (Number.isNaN(val)) val = '';
                            setCurChapter(val)
                        }}
                        onBlur={(e) => {
                            let val = parseInt(e.target.value)
                            if (Number.isNaN(val) || val < 1) setCurChapter(1);
                            else if (typeof max_chapters == "number" && val > max_chapters) setCurChapter(max_chapters)
                            else setCurChapter(val)
                        }}
                        min={1}
                        max={max_chapters}
                        className="border-2 border-black p-1 rounded-lg w-24"
                    />
                    <span className="text-xs text-gray-500">Max: {max_chapters === "" ? 1 : max_chapters}</span>
                </label>
                <label className="flex items-center gap-2">
                    <span className="font-bold">Set Max Chapters: </span> 
                    <input 
                        type="text"
                        name="max_chapters"
                        value={max_chapters}
                        onChange={(e) => {
                            let val: number | '' = parseInt(e.target.value)
                            if (Number.isNaN(val)) val = ''
                            setMaxChapters(val)
                        }}
                        onBlur={(e) => {
                            const val = parseInt(e.target.value)
                            if (Number.isNaN(val) || val < 1) {
                                setMaxChapters(1);
                                setCurChapter(1);
                                return;
                            }
                            if (typeof cur_chapter == "number" && val < cur_chapter) setCurChapter(val)
                            else setMaxChapters(val)
                        }}
                        min={1}
                        className="border-2 border-black p-1 rounded-lg w-24"
                    />
                    <button type="submit" className="border-2 border-black p-1 rounded-lg hover:bg-black/5 cursor-pointer grow px-1">Save</button>
                    <button onClick={handleDeleteClick} className="border-2 p-2 rounded-lg w-12 h-12 bg-black ml-auto cursor-pointer hover:bg-gray-800">
                        <img src="/trash-can.svg" alt="trash" />
                    </button>
                </label>
                {tracking_enabled && (
                    <span className="text-xs text-gray-500">
                    Tracking is {tracking ? "enabled" : "disabled"}. Editing the max chapters will turn off tracking and set the last checked date to now. 
                    <br/>To re-enable tracking, edit the manga again and set the max chapters to empty or 1.
                    </span>
                )}
            </form>
        </div>
    )
}