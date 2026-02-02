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
      setDraft({ ...user, roleIds: user.roles ? user.roles.map((r) => r.id) : [] });
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
        await adminService.deleteUser(draft.id);
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
      if (user.status === 'ACTIVE') {
        await adminService.deactivateUser(user.id);
      } else {
        await adminService.activateUser(user.id);
      }
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to toggle status.');
    } finally {
      setLoading(false);
    }
  };

  const statusTone = (s) => (s === 'ACTIVE' ? 'green' : s === 'SUSPENDED' ? 'red' : 'yellow');

  return (
    <div className="p-8 max-w-6xl space-y-6">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400 font-mono">{error}</div>}
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">Users</div>
              <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">Manage all users in the system.</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div style={{ width: 140 }}>
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
              <div style={{ width: 160 }}>
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

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-base">search</span>
                <input
                  className="pl-10 pr-3 py-2 w-48 max-w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-zinc-600 rounded-[4px]" // rounded matched react-select default
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => openModal('create')}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-100 dark:border-zinc-800">
              <tr>
                {['ID', 'Email', 'Full Name', 'Roles', 'Status'].map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
                <th className="text-right px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200 font-mono">{u.id}</td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">{u.fullName}</td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">
                      <div className="flex flex-wrap gap-2">
                        {u.roles?.map((r) => (
                          <Pill key={r.id}>{r.name}</Pill>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4"><Pill tone={statusTone(u.status)}>{u.status}</Pill></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toggleStatus(u)} className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-950 transition-colors">
                          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openModal('edit', u)} className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-950 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => openModal('delete', u)} className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/10 transition-colors">
                          Delete
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
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors">
              Cancel
            </button>
            <button onClick={handleCrudAction} className={`px-4 py-2 text-xs font-sans uppercase tracking-widest ${modalType === 'delete' ? 'border border-red-500/30 text-white bg-red-600 hover:bg-red-700' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'} transition-colors`}>
              {modalType}
            </button>
          </>
        }
      >
        {modalType === 'delete' ? (
          <div className="text-sm text-neutral-700 dark:text-zinc-200">
            You are about to delete:
            <div className="mt-3 p-3 border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950 rounded">
              <div className="font-mono text-xs text-neutral-500 dark:text-zinc-400">ID: {draft.id}</div>
              <div className="text-sm">{draft.email}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Full Name</label>
              <input className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm" value={draft.fullName || ''} onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Email</label>
              <input className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm" value={draft.email || ''} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
            {modalType === 'create' && (
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Password</label>
                <input type="password" className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm" value={draft.password || ''} onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Roles</label>
              <Select
                isMulti
                options={roleOptions}
                value={roleOptions.filter(o => draft.roleIds?.includes(o.value))}
                onChange={handleRoleChange}
                className="mt-2 text-sm"
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Status</label>
              <select className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm" value={draft.status || 'ACTIVE'} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
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
