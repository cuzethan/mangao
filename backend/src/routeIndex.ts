import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mangaRouter from './routes/mangaRouter.ts'
import authRouter from './routes/authRouter.ts'


export default function (app: express.Application) {
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true
    }));

    app.use(cookieParser())

    app.get('/', (req, res) => { res.send("mangao backend is running :)") })
    app.use('/api/mangas', mangaRouter)
    app.use('/api/auth', authRouter)
}