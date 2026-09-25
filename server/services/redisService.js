import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let redisClient = null;
let isRedisConnected = false;

try {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        // Stop retrying if Redis server is not reachable
        return null;
      }
      return Math.min(times * 100, 2000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    console.log('Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    // Log once without crashing
  });

  // Attempt initial lazy connection asynchronously
  redisClient.connect().catch(() => {
    isRedisConnected = false;
    console.log('Redis connection unavailable - falling back to MongoDB');
  });
} catch (error) {
  isRedisConnected = false;
  console.log('Redis client initialization skipped - using MongoDB fallback');
}

/**
 * Get value from Redis cache safely
 */
export const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
};

/**
 * Set value in Redis cache safely
 */
export const setCache = async (key, value, ttlInSeconds = 3600) => {
  if (!isRedisConnected || !redisClient) return;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlInSeconds) {
      await redisClient.set(key, serialized, 'EX', ttlInSeconds);
    } else {
      await redisClient.set(key, serialized);
    }
  } catch (err) {
    // Ignore cache set failures
  }
};

/**
 * Delete key from Redis cache
 */
export const delCache = async (key) => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    // Ignore cache deletion failures
  }
};

/**
 * Helper to check connection status
 */
export const getRedisStatus = () => ({
  connected: isRedisConnected,
  url: REDIS_URL,
});

export default {
  redisClient,
  getCache,
  setCache,
  delCache,
  getRedisStatus,
};
