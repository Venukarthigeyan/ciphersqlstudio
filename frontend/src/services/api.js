import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });
 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const getMe = () => api.get('/auth/me');

export const fetchAssignments = () => api.get('/assignments');
export const fetchAssignment = (id) => api.get(`/assignments/${id}`);
export const executeQuery = (assignmentId, query, schemaName, userId) =>
  api.post('/query/execute', { assignmentId, query, schemaName, userId });
export const getHint = (question, userQuery, tableSchema) =>
  api.post('/hints', { question, userQuery, tableSchema });
export const fetchProgress = (assignmentId, userId) =>
  api.get(`/progress/${assignmentId}?userId=${userId || 'anonymous'}`);