import axios from 'axios';
import { supabase, authMode } from '../lib/supabase';

// Use local backend for development, Railway for production
const isLocalDev = import.meta.env.DEV || 
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
const baseURL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` 
  : isLocalDev 
    ? 'http://localhost:8000/api/v1'
    : 'https://mindsphere-production-fc81.up.railway.app/api/v1';
console.log('🔧 API Base URL:', baseURL);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  if (authMode === 'google' && supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getData<T>(promise: Promise<{ data: T }>): Promise<T> {
  const { data } = await promise;
  return data;
}

export default api;