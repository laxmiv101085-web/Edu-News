import Redis from 'ioredis';

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error('REDIS_URL is not defined');
};

let redis: Redis | null = null;

export const getRedisClient = () => {
    if (!redis) {
        try {
            redis = new Redis(getRedisUrl());
        } catch (error) {
            console.warn('Failed to connect to Redis, falling back to in-memory (not implemented)', error);
            // In a real app, you might want a fallback or just fail hard
            return null;
        }
    }
    return redis;
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
    const client = getRedisClient();
    if (!client) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
};

export const cacheSet = async (key: string, value: any, ttlSeconds: number = 300) => {
    const client = getRedisClient();
    if (!client) return;
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};
