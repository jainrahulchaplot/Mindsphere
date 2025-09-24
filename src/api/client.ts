import axios from 'axios';
import { supabase, authMode } from '../lib/supabase';

// Use local backend for development, Railway for production
const isLocalDev = import.meta.env.DEV || 
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

// Use environment variable if available, otherwise fallback to Railway
const baseURL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : isLocalDev 
    ? 'http://localhost:8000/api/v1'
    : 'https://mindsphere-production-fc81.up.railway.app/api/v1';
console.log('🔧 API Base URL:', baseURL);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('🔧 Hostname:', window.location.hostname);
console.log('🔧 isLocalDev:', isLocalDev);
console.log('🔧 All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

export const api = axios.create({ baseURL });

// Add interceptor to log every request
api.interceptors.request.use((config) => {
  console.log('🌐 Making API request to:', config.baseURL + config.url);
  console.log('🌐 Request config:', {
    baseURL: config.baseURL,
    url: config.url,
    fullURL: config.baseURL + config.url,
    method: config.method,
    headers: config.headers
  });
  return config;
}, (error) => {
  console.error('❌ API request error:', error);
  return Promise.reject(error);
});

api.interceptors.request.use(async (config) => {
  // Always try to get JWT token if Supabase is available
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔍 Added JWT token to request');
      }
    } catch (error) {
      console.log('🔍 Could not get JWT token:', error.message);
    }
  }
  return config;
});

export async function getData<T>(promise: Promise<{ data: T }>): Promise<T> {
  const { data } = await promise;
  return data;
}

export default api;