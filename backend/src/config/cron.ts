import cron from 'node-cron'
import { pullMangaUpdates, updateUsersTrackingStatus } from '../services/mangaServices.ts';

export const pullMangaUpdatesCron = () => {
    cron.schedule('0 * * * *', () => {
        console.log('Pulling manga updates every hour');
        pullMangaUpdates();
    });
};

export const updateMangaCheckedCron = () => {
    cron.schedule('0 * * * *', () => {
        console.log('Updating manga_checked field every hour');
        updateUsersTrackingStatus();
    });
}