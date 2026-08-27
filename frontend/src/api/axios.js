import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

const toArr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);

const normalize = (node) => {
  if (Array.isArray(node)) {
    node.forEach(normalize);
    return node;
  }
  if (node && typeof node === 'object') {
    if (typeof node.id !== 'undefined' && typeof node._id === 'undefined') {
      node._id = node.id;
    }
    for (const key of Object.keys(node)) {
      const val = node[key];
      if (val && typeof val === 'object') {
        if (Array.isArray(val)) toArr(val).forEach(normalize);
        else normalize(val);
      }
    }
  }
  return node;
};

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    if (response.data) {
      try {
        normalize(response.data);
      } catch (e) {
        console.error('normalize error', e);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
