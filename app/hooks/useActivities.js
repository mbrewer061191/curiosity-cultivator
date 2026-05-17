'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const TABLE_NAME = 'activities';

export function useActivities() {
    const [activities, setActivities] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Initial fetch
        const fetchActivities = async () => {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('*')
                .order('createdAt', { ascending: false });
            
            if (error) {
                console.error('Supabase fetch error:', error);
            } else {
                setActivities(data || []);
            }
            setLoaded(true);
        };

        fetchActivities();

        // Real-time listener
        const channel = supabase
            .channel('public:activities')
            .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setActivities(prev => [payload.new, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } else if (payload.eventType === 'DELETE') {
                    setActivities(prev => prev.filter(activity => activity.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setActivities(prev => prev.map(activity => activity.id === payload.new.id ? payload.new : activity));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addActivity = async (activity) => {
        try {
            let fileUrl = null;
            const fileObj = activity.fileObj;
            
            // Remove fileObj from payload since it's not a DB column
            delete activity.fileObj;

            if (fileObj) {
                // Generate unique filename
                const uniqueFileName = `${Date.now()}_${fileObj.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('attachments')
                    .upload(uniqueFileName, fileObj);
                
                if (uploadError) {
                    console.error('File upload error:', uploadError);
                    throw uploadError;
                }
                
                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('attachments')
                    .getPublicUrl(uniqueFileName);
                    
                fileUrl = urlData.publicUrl;
            }

            const { error } = await supabase
                .from(TABLE_NAME)
                .insert([{ ...activity, fileUrl }]);
            
            if (error) throw error;
        } catch (e) {
            console.error('Failed to add activity', e);
        }
    };

    const deleteActivity = async (id) => {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (e) {
            console.error('Failed to delete activity', e);
        }
    };

    const updateActivity = async (id, changes) => {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update(changes)
                .eq('id', id);

            if (error) throw error;
        } catch (e) {
            console.error('Failed to update activity', e);
        }
    };

    return { activities, addActivity, deleteActivity, updateActivity, loaded };
}
