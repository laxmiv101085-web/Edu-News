import { adminDb } from './firebase-admin';

// Simple abstraction to switch DBs if needed later
export const db = {
    collection: (name: string) => {
        if (!adminDb) throw new Error('Firebase not initialized');
        return adminDb.collection(name);
    },
    doc: (path: string) => {
        if (!adminDb) throw new Error('Firebase not initialized');
        return adminDb.doc(path);
    },
    getDoc: async (collection: string, id: string) => {
        if (!adminDb) throw new Error('Firebase not initialized');
        const doc = await adminDb.collection(collection).doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },
    setDoc: async (collection: string, id: string, data: any) => {
        if (!adminDb) throw new Error('Firebase not initialized');
        await adminDb.collection(collection).doc(id).set(data, { merge: true });
    },
    addDoc: async (collection: string, data: any) => {
        if (!adminDb) throw new Error('Firebase not initialized');
        const res = await adminDb.collection(collection).add(data);
        return res.id;
    },
    query: async (collection: string, filters: { field: string; op: string; value: any }[]) => {
        if (!adminDb) throw new Error('Firebase not initialized');
        let q: FirebaseFirestore.Query = adminDb.collection(collection);
        filters.forEach((f) => {
            q = q.where(f.field, f.op as FirebaseFirestore.WhereFilterOp, f.value);
        });
        const snapshot = await q.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
};
