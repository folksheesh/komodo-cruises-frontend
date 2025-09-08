import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE || 'https://795b262e37b3.ngrok-free.app/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Generic fetcher for React Query
export async function get(url, config) {
  const { data } = await api.get(url, config);
  return data;
}

export async function post(url, body, config) {
  const { data } = await api.post(url, body, config);
  return data;
}

export async function mutate(url) {
  const { data } = await api.post(url);
  return data;
}

export { BASE_URL };
