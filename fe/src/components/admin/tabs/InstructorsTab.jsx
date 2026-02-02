import { useMemo, useState } from 'react';
import AdminModal from '../common/AdminModal';
import Pill from '../common/Pill';

const InstructorsTab = () => {
  const [query, setQuery] = useState('');

  const [instructors, setInstructors] = useState([
    { id: '3', email: 'instructor@trickcode.local', courses: 2, status: 'APPROVED' },
    { id: '4', email: 'pending@trickcode.local', courses: 0, status: 'PENDING' },
  ]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draft, setDraft] = useState({ id: '', email: '' });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return instructors;
    return instructors.filter((i) => i.email.toLowerCase().includes(q));
  }, [query, instructors]);

  const openDelete = (instructor) => {
    setDraft(instructor);
    setDeleteOpen(true);
  };

  const deleteInstructor = () => {
    setInstructors((prev) => prev.filter((i) => i.id !== draft.id));
    setDeleteOpen(false);
  };

  const toggleApproval = (instructor) => {
    setInstructors((prev) =>
      prev.map((i) =>
        i.id === instructor.id ? { ...i, status: i.status === 'APPROVED' ? 'PENDING' : 'APPROVED' } : i
      )
    );
  };

  const statusTone = (s) => (s === 'APPROVED' ? 'green' : 'yellow');

  return (
    <div className="p-8 max-w-6xl space-y-6">
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">Instructors</div>
              <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">KYC / approval workflow (demo).</div>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-base">search</span>
              <input
                className="pl-10 pr-3 py-2 w-64 max-w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-zinc-600"
                placeholder="Search by email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-100 dark:border-zinc-800">
              <tr>
                {['ID', 'Email', 'Courses', 'Status'].map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
                <th className="text-right px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200 font-mono">{i.id}</td>
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">{i.email}</td>
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">{i.courses}</td>
                  <td className="px-6 py-4"><Pill tone={statusTone(i.status)}>{i.status}</Pill></td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleApproval(i)}
                        className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-950 transition-colors"
                      >
                        {i.status === 'APPROVED' ? 'Revoke' : 'Approve'}
                      </button>
                      <button
                        onClick={() => openDelete(i)}
                        className="px-3 py-2 text-[10px] font-sans uppercase tracking-widest border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        title="Delete Instructor"
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteInstructor}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-red-500/30 text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-sm text-neutral-700 dark:text-zinc-200">
          You are about to delete instructor:
          <div className="mt-3 p-3 border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950 rounded">
            <div className="font-mono text-xs text-neutral-500 dark:text-zinc-400">Email</div>
            <div className="text-sm">{draft.email}</div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default InstructorsTab;
