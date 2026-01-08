import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL is not defined');
}

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});



// --- INTERCEPTOR: Tempelkan Token Login secara otomatis ---
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- INTERCEPTOR: Logout otomatis jika session habis (401) ---
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
  // ==========================================
  // --- AUTHENTICATION (Pusat Akses) ---
  // ==========================================
  async login(email: string, password: string) {
    const response = await API.post('/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data.user;
  },

  async register(name: string, email: string, password: string) {
    return (await API.post('/register', { name, email, password })).data;
  },

  async logout() {
    try { await API.post('/logout'); } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('ddp_user');
    }
  },

  // ==========================================
  // --- GENERIC CRUD (Handel Semua Modul) ---
  // ==========================================
  async getData(resource: string) {
    const response = await API.get(`/${resource}`);
    return response.data;
  },

  async saveData(resource: string, data: any) {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];
      // Jika data adalah array (seperti Multiple Upload Infografis)
      if (key === 'gambar' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('gambar[]', file);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (data.id) {
      // METHOD SPOOFING: Kirim POST tapi Laravel baca sebagai PUT (Wajib untuk Update File)
      formData.append('_method', 'PUT');
      const response = await API.post(`/${resource}/${data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      const response = await API.post(`/${resource}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  },

  async deleteData(resource: string, id: number) {
    const response = await API.delete(`/${resource}/${id}`);
    return response.data;
  },

  // ==========================================
  // --- USER MANAGEMENT (Super Admin) ---
  // ==========================================
  async getUsers() {
    return (await API.get('/users')).data;
  },

  async toggleApproval(id: number) {
    return (await API.post(`/users/${id}/toggle-approve`)).data;
  },

  // ==========================================
  // --- LOGIKA KHUSUS TOGGLE BERANDA ---
  // ==========================================
  async toggleMonografiFeatured(id: number) {
    return (await API.post(`/monografi/${id}/toggle-featured`)).data;
  },

  async toggleInfografisHome(id: number) {
    return (await API.post(`/infografis/${id}/toggle-home`)).data;
  },

  async toggleTestimoniTampil(id: number) {
    return (await API.post(`/testimoni/${id}/toggle-tampil`)).data;
  },

  // ==========================================
  // --- STATISTICS & OTHERS ---
  // ==========================================
  async getStats() {
    return (await API.get('/stats/capaian')).data;
  }
};