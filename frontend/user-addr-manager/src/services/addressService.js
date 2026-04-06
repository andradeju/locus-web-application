import api from './api';

export const createAddress = (userId, data) => api.post(`/users/${userId}/addresses`, data);
export const getAddressesByUser = (userId) => api.get(`/users/${userId}/addresses`);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
export const setPrincipalAddress = (id) => api.patch(`/addresses/${id}/principal`);
export const getAddressByCep = (cep) => api.get(`/cep/${cep}`);