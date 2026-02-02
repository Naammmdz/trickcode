import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

export const adminService = {
  // Users
  getUsers: (params) => apiClient.get(API_ENDPOINTS.ADMIN.USERS.LIST, { params }),
  createUser: (data) => apiClient.post(API_ENDPOINTS.ADMIN.USERS.CREATE, data),
  updateUser: (id, data) => apiClient.put(API_ENDPOINTS.ADMIN.USERS.UPDATE(id), data),
  deleteUser: (id) => apiClient.delete(API_ENDPOINTS.ADMIN.USERS.DELETE(id)),
  activateUser: (id) => apiClient.put(API_ENDPOINTS.ADMIN.USERS.ACTIVATE(id)),
  deactivateUser: (id) => apiClient.put(API_ENDPOINTS.ADMIN.USERS.DEACTIVATE(id)),

  // Roles
  getRoles: (params) => apiClient.get(API_ENDPOINTS.ADMIN.ROLES.LIST, { params }),
  createRole: (data) => apiClient.post(API_ENDPOINTS.ADMIN.ROLES.CREATE, data),
  updateRole: (id, data) => apiClient.put(API_ENDPOINTS.ADMIN.ROLES.UPDATE(id), data),
  deleteRole: (id) => apiClient.delete(API_ENDPOINTS.ADMIN.ROLES.DELETE(id)),

  // Permissions
  getPermissions: (params) => apiClient.get(API_ENDPOINTS.ADMIN.PERMISSIONS.LIST, { params }),
  createPermission: (data) => apiClient.post(API_ENDPOINTS.ADMIN.PERMISSIONS.CREATE, data),
  updatePermission: (id, data) => apiClient.put(API_ENDPOINTS.ADMIN.PERMISSIONS.UPDATE(id), data),
  deletePermission: (id) => apiClient.delete(API_ENDPOINTS.ADMIN.PERMISSIONS.DELETE(id)),
};
