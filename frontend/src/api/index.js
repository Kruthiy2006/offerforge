import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats').then(r => r.data);

// Candidates
export const getCandidates = (params) => api.get('/candidates', { params }).then(r => r.data);
export const getCandidate = (id) => api.get(`/candidates/${id}`).then(r => r.data);
export const createCandidate = (data) => api.post('/candidates', data).then(r => r.data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data).then(r => r.data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`).then(r => r.data);

// Templates
export const getTemplates = (params) => api.get('/templates', { params }).then(r => r.data);
export const getTemplate = (id) => api.get(`/templates/${id}`).then(r => r.data);
export const createTemplate = (data) => api.post('/templates', data).then(r => r.data);

// Offers
export const getOffers = (params) => api.get('/offers', { params }).then(r => r.data);
export const getOffer = (id) => api.get(`/offers/${id}`).then(r => r.data);
export const createOffer = (data) => api.post('/offers', data).then(r => r.data);
export const updateOfferStatus = (id, data) => api.patch(`/offers/${id}/status`, data).then(r => r.data);
export const getOfferPDF = (id) => api.get(`/offers/${id}/pdf`, { responseType: 'blob' }).then(r => r.data);

// Verification
export const verifyOffer = (id) => api.get(`/verify/${id}`).then(r => r.data);

export default api;
