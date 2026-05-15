import axios from 'axios';

import { getApiBaseUrl } from './runtimeConfig';

const API_BASE_URL = getApiBaseUrl();

let accessToken = null;
let refreshingPromise = null;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allow refresh cookie
});

export function setAccessToken(token) {
  accessToken = token || null;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    if (!original || original.__isRetry) throw error;
    if (status !== 401) throw error;

    // Avoid infinite loop: don't refresh on auth endpoints
    if (original.url?.startsWith('/auth/')) throw error;

    if (!refreshingPromise) {
      refreshingPromise = apiClient
        .post('/auth/refresh')
        .then((r) => {
          setAccessToken(r?.data?.accessToken);
          return r?.data?.accessToken;
        })
        .finally(() => {
          refreshingPromise = null;
        });
    }

    await refreshingPromise;
    original.__isRetry = true;
    return apiClient.request(original);
  },
);

