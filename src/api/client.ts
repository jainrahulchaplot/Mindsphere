import axios from 'axios';
import { supabase, authMode } from '../lib/supabase';

export const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : '/api/v1' 
});

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