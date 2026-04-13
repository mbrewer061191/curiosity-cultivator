'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'curiosity_cultivator_activities';

export function useActivities() {
    const [activities, setActivities] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setActivities(JSON.parse(stored));
        } catch (e) {
            console.error('Failed to load activities', e);
        }
        setLoaded(true);
    }, []);

    const saveActivities = (updated) => {
        setActivities(updated);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save activities', e);
        }
    };

    const addActivity = (activity) => {
        const updated = [{ ...activity, id: Date.now().toString() }, ...activities];
        saveActivities(updated);
    };

    const deleteActivity = (id) => {
        saveActivities(activities.filter(a => a.id !== id));
    };

    const updateActivity = (id, changes) => {
        saveActivities(activities.map(a => a.id === id ? { ...a, ...changes } : a));
    };

    return { activities, addActivity, deleteActivity, updateActivity, loaded };
}
