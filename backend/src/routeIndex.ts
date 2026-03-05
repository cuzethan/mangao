import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mangaRouter from './routes/mangaRouter.js'
import authRouter from './routes/authRouter.js'
import testRouter from './routes/testRouter.js'

export default function (app: express.Application) {
    app.use(cors({
        origin: [process.env.FRONTEND_URL as string, 'http://localhost:5173'],
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