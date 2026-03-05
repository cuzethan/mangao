export const baseURL = import.meta.env.BACKEND_URL || "http://localhost:3000/api"
export const defaultImgUrl = "/mangao.png"

export type Status = "completed" | "reading" | "planned" | "hold";

export type Manga = {
    id: number,
    title: string
    status: Status
    image_url: string
    tracked_max_chapters: number
    max_chapters: number
    cur_chapter: number
    tracking: boolean
    mangadex_id: string
    last_checked: Date
    tracking_enabled: boolean
    manga_checked: boolean
}

export type MangaDexManga = {
    mangadex_id: string,
    main_title: string,
    alt_title: string,
    image_url: string
    authors: string[]
}