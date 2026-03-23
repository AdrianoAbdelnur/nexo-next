import axios from 'axios';

const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';

const getTokenFromCookies = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOKEN_STORAGE_KEY}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=')[1] || '');
};

const getAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const tokenFromStorage = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (tokenFromStorage) {
    return tokenFromStorage;
  }

  return getTokenFromCookies();
};

const ClientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

ClientAxios.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default ClientAxios;
