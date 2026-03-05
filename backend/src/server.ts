import express from 'express'
import setupRoutes from './routeIndex.js'
import { pullMangaUpdatesCron, updateMangaCheckedCron } from './config/cron.js';
import { setupDatabase } from './config/setupdb.js';

const app = express();

const PORT = Number(process.env.PORT) || 3000;

setupRoutes(app)

if (process.env.NODE_ENV === 'production') { // only for production, docker will run local db
    setupDatabase()
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Production serving running on port ${PORT}`);
    pullMangaUpdatesCron();
    updateMangaCheckedCron();
});
