'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const TABLE_NAME = 'planned_activities';

export function usePlanner(monthYearString) {
    const [planned, setPlanned] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchPlanned = async () => {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .like('date', `${monthYearString}-%`);
            
            if (!error) setPlanned(data || []);
            setLoaded(true);
        };

        fetchPlanned();

        const channel = supabase
            .channel('public:planned_activities')
            .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setPlanned(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'DELETE') {
                    setPlanned(prev => prev.filter(p => p.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setPlanned(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [monthYearString]);

    const addPlannedActivity = async (activity_id, date) => {
        try {
            await supabase.from(TABLE_NAME).insert([{ activity_id, date }]);
        } catch (e) {
            console.error(e);
        }
    };

    const removePlannedActivity = async (id) => {
        try {
            await supabase.from(TABLE_NAME).delete().eq('id', id);
        } catch (e) {
            console.error(e);
        }
    };

    return { planned, addPlannedActivity, removePlannedActivity, loaded };
}
