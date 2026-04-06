import api from './api';

export const createUser = (data) => api.post('/users', data);
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);