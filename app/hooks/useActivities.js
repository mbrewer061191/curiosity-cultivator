'use client';
import { useState, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'activities';

export function useActivities() {
    const [activities, setActivities] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Real-time listener — updates on all devices instantly
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                setActivities(data);
                setLoaded(true);
            },
            (error) => {
                console.error('Firestore listener error:', error);
                setLoaded(true);
            }
        );
        return () => unsubscribe();
    }, []);

    const addActivity = async (activity) => {
        try {
            await addDoc(collection(db, COLLECTION), {
                ...activity,
                createdAt: serverTimestamp(),
            });
        } catch (e) {
            console.error('Failed to add activity', e);
        }
    };

    const deleteActivity = async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTION, id));
        } catch (e) {
            console.error('Failed to delete activity', e);
        }
    };

    const updateActivity = async (id, changes) => {
        try {
            await updateDoc(doc(db, COLLECTION, id), changes);
        } catch (e) {
            console.error('Failed to update activity', e);
        }
    };

    return { activities, addActivity, deleteActivity, updateActivity, loaded };
}
