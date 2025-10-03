import axios from 'axios';

const baseURL = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';
export const api = axios.create({ baseURL, timeout: 300000 });

// Axios response data extractor
export function getData<T>(p: Promise<{ data: T }>): Promise<T> { return p.then(r => r.data); }
