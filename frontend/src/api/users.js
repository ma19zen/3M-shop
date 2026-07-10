import API from './axios';

export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUserRole = (id, data) => API.put(`/users/${id}/role`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
