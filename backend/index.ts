import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import listingRouter from './routes/listing';
import notesRouter from './routes/notes';
import applicationsRouter from './routes/applications';
import projectsRouter from './routes/projects';
import videosRouter from './routes/videos';
import { checkAllListings } from './services/priceCheck';
import youtubeConvertRouter from './routes/youtube-covert';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', listingRouter);
app.use('/api', notesRouter);
app.use('/api', applicationsRouter);
app.use('/api', projectsRouter);
app.use('/api', videosRouter);
app.use('/api', youtubeConvertRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4001;
const checkIntervalCron = process.env.CHECK_INTERVAL_CRON ?? '0 */6 * * *';

cron.schedule(checkIntervalCron, async () => {
    console.log('[priceCheck] starting scheduled check of all listings');
    await checkAllListings();
    console.log('[priceCheck] finished scheduled check of all listings');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`[priceCheck] scheduled with cron expression "${checkIntervalCron}"`);
});
