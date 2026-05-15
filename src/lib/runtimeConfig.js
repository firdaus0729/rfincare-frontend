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

export function getApiBaseUrl() {
  return getRuntimeEnv('VITE_API_BASE_URL') || '';
}

export async function loadRuntimeConfig() {
  const base = buildTime.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  const configUrl = base ? `${base}/public/runtime-config` : '/public/runtime-config';
  try {
    const res = await fetch(configUrl, { credentials: 'omit' });
    if (res.ok) {
      const data = await res.json();
      runtime = { ...buildTime, ...(data?.vite || {}) };
    }
  } catch {
    runtime = { ...buildTime };
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
