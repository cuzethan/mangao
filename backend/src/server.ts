import express from 'express'
import setupRoutes from './routeIndex.ts'
import CONFIG from './config/env.ts';
import { pullMangaUpdatesCron, updateMangaCheckedCron } from './config/cron.ts';

const app = express();

setupRoutes(app)

app.listen(CONFIG.PORT, () => {
    console.log(`Example app listening on port ${CONFIG.PORT}`);
    pullMangaUpdatesCron();
    updateMangaCheckedCron();
});
