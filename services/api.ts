import axios from 'axios';

/**
 * LOGIKA JEMBATAN OTOMATIS:
 * Mengambil link dari Vercel Settings (VITE_API_URL).
 * Jika di laptop, otomatis pakai localhost:8000 (Docker).
 */
// @ts-ignore: Mengabaikan pengecekan tipe data untuk .env
const baseURL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api';

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    /* --- KUNCI SAKTI: Menembus layar biru Ngrok --- */
    'ngrok-skip-browser-warning': '69420'
  }
});

// Interceptor: Tempelkan Token secara otomatis
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Logout otomatis jika session habis
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('ddp_user');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  async login(email: string, password: string) {
    const response = await API.post('/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data.user;
  },

  async register(name: string, email: string, password: string) {
    const response = await API.post('/register', { name, email, password });
    return response.data;
  },

  async logout() {
    try { await API.post('/logout'); } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('ddp_user');
    }
  },

  async getUsers() {
    const response = await API.get('/users');
    return response.data;
  },

  async toggleApproval(id: number) {
    const response = await API.post(`/users/${id}/toggle-approve`);
    return response.data;
  },

  async getData(resource: string) {
    const response = await API.get(`/${resource}`);
    return response.data;
  },

  async saveData(resource: string, data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (key === 'gambar' && Array.isArray(value)) {
        value.forEach((file) => { if (file instanceof File) formData.append('gambar[]', file); });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (data.id) {
      formData.append('_method', 'PUT'); 
      return (await API.post(`/${resource}/${data.id}`, formData)).data;
    } else {
      return (await API.post(`/${resource}`, formData)).data;
    }
  },

  async deleteData(resource: string, id: number) {
    return (await API.delete(`/${resource}/${id}`)).data;
  },

  async toggleMonografiFeatured(id: number) {
    return (await API.post(`/monografi/${id}/toggle-featured`)).data;
  },

  async toggleInfografisHome(id: number) {
    return (await API.post(`/infografis/${id}/toggle-home`)).data;
  },

  async getStats() {
    return (await API.get('/stats/capaian')).data;
  },

  async toggleTestimoniTampil(id: number) {
    return (await API.post(`/testimoni/${id}/toggle-tampil`)).data;
  }
};