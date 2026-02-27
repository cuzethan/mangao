import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mangaRouter from './routes/mangaRouter.ts'
import authRouter from './routes/authRouter.ts'
import testRouter from './routes/testRouter.ts'

export default function (app: express.Application) {
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true
    }));

    app.use(express.json());
    app.use(cookieParser())

    app.get('/', (req, res) => { res.send("mangao backend is running :)") })
    app.use('/api/mangas', mangaRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/test', testRouter)
}