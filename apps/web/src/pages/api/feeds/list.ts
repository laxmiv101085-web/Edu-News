import type { NextApiRequest, NextApiResponse } from 'next';
import { getLatestNews } from '../../../lib/news/ingest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, page, limit } = req.query;

    try {
        const result = await getLatestNews(
            category as string,
            parseInt((limit as string) || '20'),
            parseInt((page as string) || '1')
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Feed fetch failed:', error);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
}
