import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken, adminDb } from '../../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Missing token' });
    }

    try {
        const decodedToken = await verifyIdToken(token);
        const uid = decodedToken.uid;

        // Sync user to Firestore if needed
        await adminDb.collection('users').doc(uid).set({
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email?.split('@')[0],
            picture: decodedToken.picture,
            lastLogin: new Date().toISOString(),
        }, { merge: true });

        res.status(200).json({ status: 'success', uid });
    } catch (error) {
        console.error('Auth verification failed:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}
