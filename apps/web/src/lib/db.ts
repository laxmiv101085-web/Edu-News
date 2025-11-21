import { adminDb } from './firebase-admin';

// Simple abstraction to switch DBs if needed later
export const db = {
    collection: (name: string) => adminDb.collection(name),
    doc: (path: string) => adminDb.doc(path),
    getDoc: async (collection: string, id: string) => {
        const doc = await adminDb.collection(collection).doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },
    setDoc: async (collection: string, id: string, data: any) => {
        await adminDb.collection(collection).doc(id).set(data, { merge: true });
    },
    addDoc: async (collection: string, data: any) => {
        const res = await adminDb.collection(collection).add(data);
        return res.id;
    },
    query: async (collection: string, filters: { field: string; op: string; value: any }[]) => {
        let q: FirebaseFirestore.Query = adminDb.collection(collection);
        filters.forEach((f) => {
            q = q.where(f.field, f.op as FirebaseFirestore.WhereFilterOp, f.value);
        });
        const snapshot = await q.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
};
