import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken, adminDb } from '../../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get the Firebase ID token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the Firebase ID token
        const decodedToken = await verifyIdToken(idToken);
        const { firebaseUid, email, name } = req.body;

        // Verify the token UID matches the request
        if (decodedToken.uid !== firebaseUid) {
            return res.status(403).json({ message: 'Token mismatch' });
        }

        // Check if user already exists in Firestore
        const userRef = adminDb.collection('users').doc(firebaseUid);
        const userDoc = await userRef.get();

        let userData;
        const timestamp = new Date().toISOString();

        if (userDoc.exists) {
            // Update existing user
            userData = userDoc.data();
            await userRef.update({
                email,
                name,
                lastLogin: timestamp
            });
        } else {
            // Create new user
            userData = {
                firebaseUid,
                email,
                name,
                createdAt: timestamp,
                lastLogin: timestamp
            };
            await userRef.set(userData);
        }

        // Return user data
        return res.status(200).json({
            user: {
                id: firebaseUid,
                firebaseUid,
                email,
                name,
                createdAt: userData?.createdAt || timestamp
            }
        });
    } catch (error: any) {
        console.error('Sync error:', error);
        return res.status(500).json({
            message: 'Failed to sync user',
            error: error.message
        });
    }
}
