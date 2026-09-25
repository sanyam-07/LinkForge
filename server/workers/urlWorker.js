import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Url from '../models/Url.js';
import { delCache } from '../services/redisService.js';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const parsedUrl = new URL(REDIS_URL.startsWith('redis://') ? REDIS_URL : `redis://${REDIS_URL}`);
const redisConfig = {
  host: parsedUrl.hostname || '127.0.0.1',
  port: parseInt(parsedUrl.port || '6379', 10),
  password: parsedUrl.password || undefined,
  maxRetriesPerRequest: null,
};

const startWorker = async () => {
  await connectDB();

  console.log('Starting BullMQ URL Worker...');

  const worker = new Worker(
    'url-lifecycle-queue',
    async (job) => {
      console.log(`Processing job ${job.name} (ID: ${job.id}) for shortCode: ${job.data.shortCode}`);

      const { urlId, shortCode } = job.data;

      if (job.name === 'expire-url-job') {
        await Url.findByIdAndUpdate(urlId, { isActive: false });
        await delCache(`url:${shortCode}`);
        console.log(`Successfully expired URL: ${shortCode}`);
      } else if (job.name === 'activate-url-job') {
        await Url.findByIdAndUpdate(urlId, { isActive: true });
        await delCache(`url:${shortCode}`);
        console.log(`Successfully activated URL: ${shortCode}`);
      }
    },
    { connection: redisConfig }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err.message);
  });

  worker.on('error', (err) => {
    console.log('Worker connection error (Redis offline)');
  });
};

startWorker().catch((err) => {
  console.log('Worker could not connect to Redis server:', err.message);
});
