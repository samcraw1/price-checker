import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import listingRouter from './routes/listing';
import { checkAllListings } from './services/priceCheck';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', listingRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
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
