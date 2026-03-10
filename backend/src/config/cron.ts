import cron from 'node-cron'
import { pullMangaUpdates, updateUsersTrackingStatus } from '../services/mangaServices.js';

export const pullMangaUpdatesCron = () => { //every 30 min
    pullMangaUpdates() 
    cron.schedule('*/30 * * * *', () => {
        pullMangaUpdates();
    });
};

export const updateMangaCheckedCron = () => { //every 5 min
    updateUsersTrackingStatus
    cron.schedule('*/5 * * * *', () => {
        updateUsersTrackingStatus();
    });
}