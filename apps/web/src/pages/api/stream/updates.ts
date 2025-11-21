import type { NextApiRequest, NextApiResponse } from 'next';
import { getRedisClient } from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'none');

    const redis = getRedisClient();
    if (!redis) {
        res.status(500).end();
        return;
    }

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // In a real app, we would subscribe to a Redis channel
    // const sub = redis.duplicate();
    // await sub.subscribe('news_updates');

    // sub.on('message', (channel, message) => {
    //   res.write(`data: ${message}\n\n`);
    // });

    // For this demo, we'll poll Redis for the latest timestamp every 30s
    // or just keep the connection open.
    // A better approach for serverless (Vercel) is to NOT use long-running SSE 
    // but rather short polling or use a dedicated WebSocket provider (Pusher/Ably).
    // However, since the user asked for SSE:

    const intervalId = setInterval(async () => {
        // Check if there's new data (simplified)
        // In reality, we'd check a 'last_updated' key
        const lastUpdated = await redis.get('last_updated');
        if (lastUpdated) {
            res.write(`data: ${JSON.stringify({ type: 'update', timestamp: lastUpdated })}\n\n`);
        }
        // Keep alive
        res.write(': keep-alive\n\n');
    }, 15000);

    req.on('close', () => {
        clearInterval(intervalId);
        // sub.quit();
        res.end();
    });
}
