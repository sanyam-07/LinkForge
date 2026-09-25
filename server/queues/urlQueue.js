import { Queue } from 'bullmq';
import { getRedisStatus } from '../services/redisService.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let urlQueue = null;

const parsedUrl = new URL(REDIS_URL.startsWith('redis://') ? REDIS_URL : `redis://${REDIS_URL}`);
const redisConfig = {
  host: parsedUrl.hostname || '127.0.0.1',
  port: parseInt(parsedUrl.port || '6379', 10),
  password: parsedUrl.password || undefined,
  maxRetriesPerRequest: null,
};

try {
  urlQueue = new Queue('url-lifecycle-queue', {
    connection: redisConfig,
  });

  urlQueue.on('error', (err) => {
    // Graceful error logging when Redis is offline
  });

  console.log('BullMQ URL lifecycle queue initialized');
} catch (err) {
  console.log('BullMQ queue initialization skipped (Redis unavailable)');
}

/**
 * Schedule URL expiration job
 */
export const scheduleUrlExpiration = async (urlId, shortCode, delayMs) => {
  if (!urlQueue || !getRedisStatus().connected) return;
  try {
    await urlQueue.add(
      'expire-url-job',
      { urlId, shortCode },
      {
        delay: delayMs,
        jobId: `expire:${urlId}`,
        removeOnComplete: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    );
  } catch (err) {
    // Ignore queue failure fallback
  }
};

/**
 * Schedule URL activation job
 */
export const scheduleUrlActivation = async (urlId, shortCode, delayMs) => {
  if (!urlQueue || !getRedisStatus().connected) return;
  try {
    await urlQueue.add(
      'activate-url-job',
      { urlId, shortCode },
      {
        delay: delayMs,
        jobId: `activate:${urlId}`,
        removeOnComplete: true,
        attempts: 3,
      }
    );
  } catch (err) {
    // Ignore queue failure fallback
  }
};

export default {
  urlQueue,
  scheduleUrlExpiration,
  scheduleUrlActivation,
};
