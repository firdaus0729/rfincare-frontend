const buildTime = {
  VITE_API_BASE_URL: import.meta.env?.VITE_API_BASE_URL || '',
  VITE_GA_MEASUREMENT_ID: import.meta.env?.VITE_GA_MEASUREMENT_ID || '',
  VITE_SUPABASE_URL: import.meta.env?.VITE_SUPABASE_URL || '',
};

let runtime = { ...buildTime };
let loaded = false;

export function getRuntimeEnv(key) {
  return runtime[key] ?? buildTime[key] ?? '';
}

const PRODUCTION_API_BASE = 'https://rfincare-backend.onrender.com';

function inferApiBaseFromHost() {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (
    host === 'rfincare-frontend.vercel.app'
    || host.endsWith('.vercel.app')
    || host === 'rfincare.com'
    || host === 'www.rfincare.com'
  ) {
    return PRODUCTION_API_BASE;
  }
  return '';
}

export function getApiBaseUrl() {
  return getRuntimeEnv('VITE_API_BASE_URL') || inferApiBaseFromHost() || '';
}

export async function loadRuntimeConfig() {
  const buildBase = buildTime.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  const inferredBase = inferApiBaseFromHost();
  const fetchBase = buildBase || inferredBase;
  const configUrl = fetchBase
    ? `${fetchBase}/public/runtime-config`
    : '/public/runtime-config';
  try {
    const res = await fetch(configUrl, { credentials: 'omit' });
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        runtime = { ...buildTime, ...(data?.vite || {}) };
      }
    }
  } catch {
    runtime = { ...buildTime };
  }
  if (!runtime.VITE_API_BASE_URL && inferredBase) {
    runtime.VITE_API_BASE_URL = inferredBase;
  }
  loaded = true;
  return runtime;
}

export function isRuntimeConfigLoaded() {
  return loaded;
}

export function applyRuntimeToApiClient(apiClient) {
  const base = getApiBaseUrl();
  if (base) apiClient.defaults.baseURL = base;
}
