import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Dispatch a global event so NotificationContext can display an error toast
    const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
    window.dispatchEvent(new CustomEvent('api-error', { detail: Array.isArray(message) ? message[0] : message }));

    return Promise.reject(err);
  },
);

// Auth
export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);
export const register = (data: { email: string; password: string; role: string }) =>
  api.post('/auth/register', data);

// Patients
export const getPatients = () => api.get('/patients');
export const createPatient = (data: any) => api.post('/patients', data);
export const updatePatient = (id: number, data: any) => api.patch(`/patients/${id}`, data);
export const deletePatient = (id: number) => api.delete(`/patients/${id}`);

// Clinicians
export const getClinicians = () => api.get('/clinicians');
export const createClinician = (data: any) => api.post('/clinicians', data);
export const updateClinician = (id: number, data: any) => api.patch(`/clinicians/${id}`, data);
export const deleteClinician = (id: number) => api.delete(`/clinicians/${id}`);

// Visits
export const getVisits = () => api.get('/visits');
export const createVisit = (data: any) => api.post('/visits', data);
export const updateVisit = (id: number, data: any) => api.patch(`/visits/${id}`, data);
export const deleteVisit = (id: number) => api.delete(`/visits/${id}`);
export const getStats = () => api.get('/visits/stats');

export default api;
