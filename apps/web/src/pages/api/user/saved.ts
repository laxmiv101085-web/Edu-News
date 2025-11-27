import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken, adminDb } from '../../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    let uid;

    try {
        const decoded = await verifyIdToken(token);
        uid = decoded.uid;
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.method === 'GET') {
        // Get saved articles
        if (!adminDb) {
            return res.status(500).json({ error: 'Database not initialized' });
        }
        const snapshot = await adminDb.collection('users').doc(uid).collection('saved').orderBy('savedAt', 'desc').get();
        const saved = snapshot.docs.map(doc => doc.data());
        return res.status(200).json({ saved });
    }

    if (req.method === 'POST') {
        // Save article
        const { article } = req.body;
        if (!article || !article.id) {
            return res.status(400).json({ error: 'Invalid article data' });
        }

        if (!adminDb) {
            return res.status(500).json({ error: 'Database not initialized' });
        }
        await adminDb.collection('users').doc(uid).collection('saved').doc(article.id).set({
            ...article,
            savedAt: new Date().toISOString(),
        });

        return res.status(200).json({ status: 'saved' });
    }

    if (req.method === 'DELETE') {
        // Remove article
        const { articleId } = req.body;
        if (!articleId) {
            return res.status(400).json({ error: 'Missing articleId' });
        }

        if (!adminDb) {
            return res.status(500).json({ error: 'Database not initialized' });
        }
        await adminDb.collection('users').doc(uid).collection('saved').doc(articleId).delete();
        return res.status(200).json({ status: 'removed' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
