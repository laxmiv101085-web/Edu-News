import type { NextApiRequest, NextApiResponse } from 'next';
import { getLatestNews } from '../../../lib/news/ingest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, page, limit } = req.query;

    try {
        const limitNum = parseInt((limit as string) || '20');
        const pageNum = parseInt((page as string) || '1');

        const result = await getLatestNews(
            category as string,
            limitNum,
            pageNum
        );

        const response = {
            items: result.articles,
            pagination: {
                page: pageNum,
                totalPages: Math.ceil(result.total / limitNum),
                totalItems: result.total
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Feed fetch failed:', error);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
}
