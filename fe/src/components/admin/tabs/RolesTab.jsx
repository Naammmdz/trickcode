import { useEffect, useState } from 'react';
import AdminModal from '../AdminModal';
import Pill from '../common/Pill';
import Pagination from '../common/Pagination';
import { adminService } from '../../../services/adminService';

const RolesTab = () => {
  const [query, setQuery] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'delete'
  const [draft, setDraft] = useState({ name: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const rolesResp = await adminService.getRoles({ page, size, q: query });
      const rolesData = rolesResp?.content ? rolesResp : { content: rolesResp || [], totalPages: 1, totalElements: (rolesResp || []).length };

      setRoles(rolesData.content || []);
      setTotalPages(rolesData.totalPages || 0);
      setTotalElements(rolesData.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch roles.');
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
      setPage(0);
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const openModal = (type, role = null) => {
    setModalType(type);
    if (type === 'create') {
      setDraft({ name: '' });
    } else if (type === 'delete' && role) {
      setDraft(role);
    }
    setIsModalOpen(true);
  };

  const handleCrudAction = async () => {
    try {
      setError('');
      setLoading(true);

      if (modalType === 'create') {
        await adminService.createRole(draft);
      } else if (modalType === 'delete') {
        await adminService.deleteRole(draft?.id || draft?.name);
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || `Failed to ${modalType} role.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl space-y-6">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400 font-mono">{error}</div>}
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">Roles</div>
              <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">Manage authorities (roles). Backend supports Create / Read / Delete.</div>
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
                {['Role'].map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
                <th className="text-right px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">Loading...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={2} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">No roles found.</td></tr>
              ) : (
                roles.map((r, idx) => {
                  const roleName = typeof r === 'string' ? r : (r?.name || r?.id || '');
                  const roleKey = roleName ? roleName : String(idx);

                  return (
                    <tr key={roleKey} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                      <td className="px-6 py-4"><Pill>{roleName}</Pill></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal('delete', r)}
                            className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
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

      <AdminModal
        title={modalType === 'create' ? 'Create Role' : 'Delete Role'}
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
            You are about to delete role: <Pill>{draft?.name || draft?.id || ''}</Pill>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Role Name</label>
              <input
                className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm"
                value={draft.name || ''}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="ROLE_ADMIN"
              />
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default RolesTab;
