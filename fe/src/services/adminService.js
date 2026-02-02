import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

// Helper to adapt JHipster User (AdminUserDTO) to Frontend User model
const adaptUserToFrontend = (u) => ({
  id: u.id,
  login: u.login, // Important for updates/deletes
  email: u.email,
  fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.login,
  firstName: u.firstName,
  lastName: u.lastName,
  status: u.activated ? 'ACTIVE' : 'INACTIVE',
  roles: (u.authorities || []).map(a => ({ id: a, name: a })), // JHipster returns ["ROLE_ADMIN"]
  createdDate: u.createdDate,
  langKey: u.langKey
});

// Helper to adapt Frontend User draft to JHipster AdminUserDTO
const adaptDraftToBackend = (draft) => {
  const names = (draft.fullName || '').split(' ');
  const firstName = names[0] || 'User';
  const lastName = names.slice(1).join(' ') || '';

  return {
    id: draft.id,
    login: draft.login || draft.email, // JHipster needs login, default to email if missing
    email: draft.email,
    firstName: draft.firstName || firstName,
    lastName: draft.lastName || lastName,
    activated: draft.status === 'ACTIVE',
    authorities: (draft.roleIds || []).map(r => r), // roleIds should be array of strings ['ROLE_ADMIN']
    langKey: 'en'
  };
};

export const adminService = {
  // Users
  getUsers: async (params) => {
    // Client-side filtering: BE only supports page/size/sort.
    // We fetch a bigger slice, filter locally, then paginate locally.
    const pageSize = params.size ?? 10;
    const pageIndex = params.page ?? 0;

    const qRaw = (params.q ?? '').trim().toLowerCase();
    const statusFilter = params.status ?? null; // 'ACTIVE' | 'INACTIVE' | ...
    const roleFilter = params.roleId ?? null; // e.g. 'ROLE_ADMIN'

    // If there is any filter/search, we need more data than a single page.
    // Pull up to 1000 records (or 5 pages when no filters) to keep things responsive.
    const shouldFilter = Boolean(qRaw || statusFilter || roleFilter);
    const fetchSize = shouldFilter ? 1000 : pageSize;
    const fetchPage = shouldFilter ? 0 : pageIndex;

    const queryParams = {
      page: fetchPage,
      size: fetchSize,
      sort: 'id,asc',
    };

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS.LIST, { params: queryParams });

    const all = (response.data || []).map(adaptUserToFrontend);

    const filtered = all.filter((u) => {
      if (statusFilter && u.status !== statusFilter) return false;
      if (roleFilter) {
        const hasRole = (u.roles || []).some((r) => (r?.id || r) === roleFilter || (r?.name || r) === roleFilter);
        if (!hasRole) return false;
      }
      if (qRaw) {
        const hay = `${u.login || ''} ${u.email || ''} ${u.fullName || ''}`.toLowerCase();
        if (!hay.includes(qRaw)) return false;
      }
      return true;
    });

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    const start = pageIndex * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      totalElements,
      totalPages,
    };
  },

  createUser: async (data) => {
    const payload = adaptDraftToBackend(data);
    // JHipster create requires password
    payload.password = data.password;
    return apiClient.post(API_ENDPOINTS.ADMIN.USERS.CREATE, payload);
  },

  updateUser: async (id, data) => {
    // id argument might be numeric ID, but update URL /api/admin/users doesn't use ID in path usually (it uses body ID).
    // But JHipster PUT /api/admin/users updates based on ID in body.
    // There is also PUT /api/admin/users (no path var).
    const payload = adaptDraftToBackend(data);
    return apiClient.put(API_ENDPOINTS.ADMIN.USERS.UPDATE(), payload);
  },

  deleteUser: async (login) => {
    // JHipster requires login (username) for delete
    // Note: Frontend currently passes ID. The Component MUST be updated to pass LOGIN, 
    // OR we fetch the user by ID first (expensive).
    // Assuming we update Frontend to pass login.
    return apiClient.delete(API_ENDPOINTS.ADMIN.USERS.DELETE(login));
  },

  activateUser: async (id) => {
    // Not supported directly. Need to fetch, set activated=true, update.
    // This is inefficient but necessary if no endpoint exists.
    // Ideally Frontend passes the full object to toggleStatus.
    // For now, throw error or implement fetch-update loop? 
    // Better: The Frontend 'toggleStatus' already has the 'user' object!
    // But it calls activateUser(user.id).
    // We will change this signature to accept the USER OBJECT or LOGIN.
    console.error("Please update Frontend to call updateUser for status change.");
    throw new Error("Legacy activateUser not supported. Use updateUser.");
  },

  deactivateUser: async (id) => {
    console.error("Please update Frontend to call updateUser for status change.");
    throw new Error("Legacy deactivateUser not supported. Use updateUser.");
  },

  // Roles
  getRoles: async (params) => {
    // BE: GET /api/authorities returns List<Authority> where Authority has { name: string }
    // We normalize to FE model: { id: string, name: string }
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ROLES.LIST);

    const raw = Array.isArray(response.data) ? response.data : [];
    const rolesAll = raw
      .map((item) => {
        const name = typeof item === 'string' ? item : item?.name;
        if (!name) return null;
        return { id: name, name };
      })
      .filter(Boolean);

    // Client-side filter + pagination for Roles tab
    const qRaw = (params?.q ?? '').trim().toLowerCase();
    const filtered = qRaw
      ? rolesAll.filter((r) => (r.name || '').toLowerCase().includes(qRaw))
      : rolesAll;

    const pageSize = params?.size ?? 10;
    const pageIndex = params?.page ?? 0;

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    const start = pageIndex * pageSize;
    const content = filtered.slice(start, start + pageSize);

    return {
      content,
      totalElements,
      totalPages,
    };
  },

  createRole: async (data) => {
    // BE: POST /api/authorities with body { name: string }
    const name = (data?.name ?? data?.id ?? '').trim();
    return apiClient.post(API_ENDPOINTS.ADMIN.ROLES.LIST, { name });
  },
  updateRole: (id, data) => Promise.reject("Update Role not supported: backend has no PUT/PATCH /api/authorities"),
  deleteRole: async (id) => {
    // BE: DELETE /api/authorities/{id} where id is authority name
    const authorityName = (id?.name ?? id?.id ?? id ?? '').toString();
    return apiClient.delete(`/api/authorities/${encodeURIComponent(authorityName)}`);
  },

  // Permissions (Not implemented)
  getPermissions: (params) => Promise.resolve({ content: [] }),
  createPermission: (data) => Promise.resolve(),
  updatePermission: (id, data) => Promise.resolve(),
  deletePermission: (id) => Promise.resolve(),
};
