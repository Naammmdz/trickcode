import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import AdminModal from '../AdminModal';
import Pill from '../common/Pill';
import Pagination from '../common/Pagination';
import { adminService } from '../../../services/adminService';
import { getSelectStyles } from '../styles';

const RolesTab = () => {
  const [query, setQuery] = useState('');
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [draft, setDraft] = useState({});

  const [viewingPermissions, setViewingPermissions] = useState(null);

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

      const [rolesResp, fetchedPermissions] = await Promise.all([
        adminService.getRoles({ page, size, q: query }),
        adminService.getPermissions({ page: 0, size: 100 }), // Get permissions for selection
      ]);

      const rolesData = rolesResp.content ? rolesResp : { content: rolesResp, totalPages: 1, totalElements: rolesResp?.length || 0 };
      const permsData = fetchedPermissions.content ? fetchedPermissions.content : (fetchedPermissions || []);

      setRoles(rolesData.content || []);
      setTotalPages(rolesData.totalPages || 0);
      setTotalElements(rolesData.totalElements || 0);

      setAllPermissions(permsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset to first page on search
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const permissionOptions = useMemo(() => allPermissions.map(p => ({ value: p.id, label: p.name })), [allPermissions]);

  const openModal = (type, role = null) => {
    setModalType(type);
    if (type === 'create') {
      setDraft({ name: '', description: '', permissionIds: [] });
    } else if (role) {
      setDraft({ ...role, permissionIds: role.permissions ? role.permissions.map(p => p.id) : [] });
    }
    setIsModalOpen(true);
  };

  const handleCrudAction = async () => {
    try {
      setError('');
      setLoading(true);
      if (modalType === 'create') {
        await adminService.createRole(draft);
      } else if (modalType === 'edit') {
        await adminService.updateRole(draft.id, draft);
      } else if (modalType === 'delete') {
        await adminService.deleteRole(draft.id);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || `Failed to ${modalType} role.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (selectedOptions) => {
    setDraft((prev) => ({ ...prev, permissionIds: selectedOptions.map(opt => opt.value) }));
  };

  return (
    <div className="p-8 max-w-6xl space-y-6">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400 font-mono">{error}</div>}
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">Roles</div>
              <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">Manage user roles and permissions.</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-base">search</span>
                <input
                  className="pl-10 pr-3 py-2 w-64 max-w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-zinc-600"
                  placeholder="Search role"
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
                {['ID', 'Role', 'Description', 'Permissions'].map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
                <th className="text-right px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">Loading...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">No roles found.</td></tr>
              ) : (
                roles.map((r) => {
                  const permissions = r.permissions || [];
                  const displayedPermissions = permissions.slice(0, 3);
                  const remainingCount = permissions.length - 3;

                  return (
                    <tr key={r.id} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                      <td className="px-6 py-4 text-sm font-mono">{r.id}</td>
                      <td className="px-6 py-4"><Pill>{r.name}</Pill></td>
                      <td className="px-6 py-4 text-sm">{r.description || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2 items-center">
                          {displayedPermissions.map((p) => (
                            <Pill key={p.id}>{p.name}</Pill>
                          ))}
                          {remainingCount > 0 && (
                            <button
                              onClick={() => setViewingPermissions(r)}
                              className="text-[10px] font-mono text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200 hover:underline cursor-pointer"
                            >
                              +{remainingCount} more
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal('edit', r)} className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-950 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => openModal('delete', r)} className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/10 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* CRUD Modal */}
      <AdminModal
        title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Role`}
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
            You are about to delete role: <Pill>{draft.name}</Pill>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Role Name</label>
              <input
                className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm"
                value={draft.name || ''}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="ADMIN"
                disabled={modalType === 'edit'}
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Description</label>
              <input
                className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm"
                value={draft.description || ''}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="What can this role do?"
              />
            </div>
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Permissions</label>
              <Select
                isMulti
                options={permissionOptions}
                value={permissionOptions.filter(o => draft.permissionIds?.includes(o.value))}
                onChange={handlePermissionChange}
                className="mt-2 text-sm"
                styles={selectStyles}
                classNamePrefix="react-select"
                closeMenuOnSelect={false}
              />
            </div>
          </div>
        )}
      </AdminModal>

      {/* Permissions Detail Modal */}
      <AdminModal
        title={viewingPermissions ? `Permissions: ${viewingPermissions.name}` : 'Permissions'}
        open={!!viewingPermissions}
        onClose={() => setViewingPermissions(null)}
        footer={
          <button onClick={() => setViewingPermissions(null)} className="px-4 py-2 text-xs font-sans uppercase tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-colors">
            Close
          </button>
        }
      >
        <div className="flex flex-wrap gap-2">
          {viewingPermissions?.permissions?.map((p) => (
            <Pill key={p.id}>{p.name}</Pill>
          ))}
        </div>
        {(!viewingPermissions?.permissions || viewingPermissions.permissions.length === 0) && (
          <div className="text-sm text-neutral-500 italic">No permissions assigned.</div>
        )}
      </AdminModal>
    </div>
  );
};

export default RolesTab;
