import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import AdminModal from '../AdminModal';
import Pill from '../common/Pill';
import Pagination from '../common/Pagination';
import { adminService } from '../../../services/adminService';
import { getSelectStyles } from '../styles';

const UsersTab = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'delete'
  const [draft, setDraft] = useState({});

  // Filter state
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'SUSPENDED', label: 'Suspended' },
  ];

  // Dynamic styles for react-select based on theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDarkTheme(document.documentElement.classList.contains('dark')); // Initial check
    return () => observer.disconnect();
  }, []);
  const selectStyles = getSelectStyles(isDarkTheme);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersResp, fetchedRoles] = await Promise.all([
        adminService.getUsers({
          page,
          size,
          q: query,
          roleId: selectedRole?.value,
          status: selectedStatus?.value
        }),
        adminService.getRoles({ page: 0, size: 100 }),
      ]);

      // Handle PageResponse structure
      const usersData = usersResp.content ? usersResp : { content: usersResp, totalPages: 1, totalElements: usersResp?.length || 0 };
      const rolesData = fetchedRoles.content ? fetchedRoles.content : (fetchedRoles || []);

      setUsers(usersData.content || []);
      setTotalPages(usersData.totalPages || 0);
      setTotalElements(usersData.totalElements || 0);

      setAllRoles(rolesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, selectedRole, selectedStatus]); // Refetch when filters change

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset to first page on search
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const roleOptions = useMemo(() => allRoles.map(r => ({ value: r.id, label: r.name })), [allRoles]);

  const openModal = (type, user = null) => {
    setModalType(type);
    if (type === 'create') {
      setDraft({ email: '', fullName: '', password: '', roleIds: [], status: 'ACTIVE' });
    } else if (user) {
      setDraft({ ...user, roleIds: (user.roles || []).map((r) => r?.id || r) });
    }
    setIsModalOpen(true);
  };

  const handleCrudAction = async () => {
    try {
      setError('');
      setLoading(true);
      if (modalType === 'create') {
        await adminService.createUser(draft);
      } else if (modalType === 'edit') {
        await adminService.updateUser(draft.id, draft);
      } else if (modalType === 'delete') {
        // JHipster uses login for delete
        await adminService.deleteUser(draft.login);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || `Failed to ${modalType} user.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (selectedOptions) => {
    setDraft((prev) => ({ ...prev, roleIds: selectedOptions.map(opt => opt.value) }));
  };

  const toggleStatus = async (user) => {
    try {
      setLoading(true);
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const updatePayload = {
        ...user,
        status: newStatus,
        roleIds: (user.roles || []).map(r => r?.id || r),
      };

      await adminService.updateUser(user.id, updatePayload);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to toggle status.');
    } finally {
      setLoading(false);
    }
  };

  const statusTone = (s) => (s === 'ACTIVE' ? 'green' : s === 'SUSPENDED' ? 'red' : 'yellow');

  const activeFilterCount = [selectedStatus, selectedRole].filter(Boolean).length;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Users</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
            Manage all users in the system.
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 text-xs font-sans uppercase tracking-widest rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create User
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 dark:text-red-400">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-lg">search</span>
            <input
              className="pl-10 pr-3 py-2.5 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:border-transparent transition-all duration-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              placeholder="Search by name, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />

          <div style={{ width: 150 }}>
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Status"
              isClearable
              styles={selectStyles}
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>
          <div style={{ width: 170 }}>
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="Role"
              isClearable
              styles={selectStyles}
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSelectedStatus(null); setSelectedRole(null); }}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Clear filters
              <span className="ml-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{activeFilterCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                {['ID', 'Email', 'Full Name', 'Roles', 'Status'].map((c) => (
                  <th key={c} className="text-left px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                    {c}
                  </th>
                ))}
                <th className="text-right px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 dark:border-t-neutral-500 rounded-full animate-spin" />
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">person_off</span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">No users found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors duration-150">
                    <td className="px-6 py-4 text-xs text-neutral-400 dark:text-neutral-500 font-mono">{u.id}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200 font-medium">{u.fullName}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1.5">
                        {(u.roles || []).map((r, idx) => {
                          const roleLabel = typeof r === 'string' ? r : (r?.name || r?.id || '');
                          const roleKey = typeof r === 'string' ? r : (r?.id || r?.name || idx);
                          return <Pill key={roleKey}>{roleLabel}</Pill>;
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4"><Pill tone={statusTone(u.status)}>{u.status}</Pill></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => toggleStatus(u)} className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200" title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                          <span className="material-symbols-outlined text-base">{u.status === 'ACTIVE' ? 'toggle_on' : 'toggle_off'}</span>
                        </button>
                        <button onClick={() => openModal('edit', u)} className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200" title="Edit">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => openModal('delete', u)} className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200" title="Delete">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalElements={totalElements}
          pageSize={size}
        />
      </div>

      <AdminModal
        title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} User`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Cancel
            </button>
            <button onClick={handleCrudAction} className={`px-4 py-2.5 text-xs font-sans uppercase tracking-widest rounded-lg ${modalType === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'} transition-colors`}>
              {modalType}
            </button>
          </>
        }
      >
        {modalType === 'delete' ? (
          <div className="text-sm text-neutral-700 dark:text-neutral-200">
            You are about to delete:
            <div className="mt-3 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
              <div className="font-mono text-xs text-neutral-400 dark:text-neutral-500">ID: {draft.id}</div>
              <div className="text-sm mt-1 font-medium">{draft.email}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Full Name</label>
              <input className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700" value={draft.fullName || ''} onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Email</label>
              <input className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700" value={draft.email || ''} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
            {modalType === 'create' && (
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Password</label>
                <input type="password" className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700" value={draft.password || ''} onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Roles</label>
              <Select
                isMulti
                options={roleOptions}
                value={roleOptions.filter(o => draft.roleIds?.includes(o.value))}
                onChange={handleRoleChange}
                className="text-sm"
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Status</label>
              <select className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700" value={draft.status || 'ACTIVE'} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default UsersTab;
