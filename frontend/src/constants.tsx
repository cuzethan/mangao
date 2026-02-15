export const baseURL = `http://localhost:${import.meta.env.VITE_PORT|| 3000}/api`
export type Status = "completed" | "reading" | "planned" | "hold";
export const defaultImgUrl = "src/assets/mangao.png"

export type Manga = {
    id: number,
    title: string
    status: Status
    imageurl: string
}