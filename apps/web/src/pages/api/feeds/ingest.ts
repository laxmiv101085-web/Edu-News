import type { NextApiRequest, NextApiResponse } from 'next';
import { ingestNews } from '../../../lib/news/ingest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Secure this endpoint with a secret key (for Cron jobs)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const articles = await ingestNews();

        // Notify SSE clients (optional, can be done via Redis PubSub in a real scaled app)
        // For now, we assume the SSE endpoint polls Redis or we trigger a webhook

        res.status(200).json({
            status: 'success',
            count: articles.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Ingestion failed:', error);
        res.status(500).json({ error: 'Ingestion failed' });
    }
}
