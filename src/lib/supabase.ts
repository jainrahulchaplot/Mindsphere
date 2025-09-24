import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (url && key) ? createClient(url, key) : null;

export const authMode = (import.meta.env.VITE_AUTH_MODE || 'demo') as 'google'|'demo';
