import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// A simple utility to get or set a unique Device ID in local storage
// to act as our "User ID" since we aren't enforcing full login auth.

export const getDeviceId = () => {
    let deviceId = localStorage.getItem('attendance_device_id');
    if (!deviceId) {
        deviceId = crypto.randomUUID(); // Generate a unique ID (UUID format)
        localStorage.setItem('attendance_device_id', deviceId);
    }
    return deviceId;
};
