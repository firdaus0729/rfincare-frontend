import axios from 'axios';
import { getApiBaseUrl } from '../lib/runtimeConfig';

function devClient() {
  return axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
  });
}

export async function checkDevSession() {
  const { data } = await devClient().get('/development-panel/session');
  return data?.authenticated === true;
}

export async function devLogin(password) {
  const { data } = await devClient().post('/development-panel/login', { password });
  return data;
}

export async function devLogout() {
  const { data } = await devClient().post('/development-panel/logout');
  return data;
}

export async function fetchEnvFiles() {
  const { data } = await devClient().get('/development-panel/env');
  return data;
}

export async function saveEnvFile(target, content) {
  const { data } = await devClient().put('/development-panel/env', { target, content });
  return data;
}

export async function refreshRuntimeConfig() {
  const base = getApiBaseUrl()?.replace(/\/$/, '') || '';
  const url = base ? `${base}/public/runtime-config` : '/public/runtime-config';
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}
