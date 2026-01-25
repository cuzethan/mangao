import express from 'express'
import setupRoutes from './routeIndex.ts'
import CONFIG from './config/env.ts';

const app = express()

setupRoutes(app)

app.listen(CONFIG.PORT, () => {
    console.log(`Example app listening on port ${CONFIG.PORT}`)
});