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
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Roles</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
            Manage authorities (roles). Backend supports Create / Read / Delete.
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 text-xs font-sans uppercase tracking-widest rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create Role
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
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-lg">search</span>
          <input
            className="pl-10 pr-3 py-2.5 w-full max-w-md bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:border-transparent transition-all duration-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            placeholder="Search role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                <th className="text-left px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">Role</th>
                <th className="text-right px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 dark:border-t-neutral-500 rounded-full animate-spin" />
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">Loading roles...</span>
                    </div>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">shield</span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">No roles found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((r, idx) => {
                  const roleName = typeof r === 'string' ? r : (r?.name || r?.id || '');
                  const roleKey = roleName ? roleName : String(idx);

                  return (
                    <tr key={roleKey} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-violet-500">shield</span>
                          </div>
                          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{roleName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => openModal('delete', r)}
                            className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
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
            You are about to delete role:
            <div className="mt-3 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-red-500">shield</span>
              </div>
              <span className="font-medium">{draft?.name || draft?.id || ''}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Role Name</label>
              <input
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
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
