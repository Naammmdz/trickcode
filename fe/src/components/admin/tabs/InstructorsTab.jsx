import { useEffect, useState } from 'react';
import apiClient from '../../../services/api';
import AdminModal from '../AdminModal';
import Pill from '../common/Pill';

const InstructorsTab = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [detailApp, setDetailApp] = useState(null);
  const [rejectApp, setRejectApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/admin/instructor-applications');
      setApplications(res.data || []);
    } catch (e) {
      setError('Failed to load applications.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await apiClient.put(`/api/admin/instructor-applications/${id}/approve`);
      await fetchApplications();
      setDetailApp(null);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectApp) return;
    try {
      setActionLoading(true);
      await apiClient.put(`/api/admin/instructor-applications/${rejectApp.id}/reject`, { reason: rejectReason });
      await fetchApplications();
      setRejectApp(null);
      setRejectReason('');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = applications.filter(a => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || a.fullName?.toLowerCase().includes(q) || a.userEmail?.toLowerCase().includes(q) || a.userLogin?.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const statusTone = (s) => s === 'APPROVED' ? 'green' : s === 'REJECTED' ? 'red' : 'yellow';
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  return (
    <div className="p-8 max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Instructor Applications</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
          Review and manage instructor applications.
          {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">{pendingCount} pending</span>}
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">search</span>
            <input
              className="pl-10 pr-3 py-2.5 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all placeholder:text-neutral-400"
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 min-w-[130px]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                {['Name', 'Email', 'Status', 'Applied', 'Actions'].map((c) => (
                  <th key={c} className={`${c === 'Actions' ? 'text-right' : 'text-left'} px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
                      <span className="text-sm text-neutral-400">Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <span className="text-sm text-red-500">{error}</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">school</span>
                      <span className="text-sm text-neutral-400">No applications found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{app.fullName}</p>
                        <p className="text-xs text-neutral-400">@{app.userLogin}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">{app.userEmail}</td>
                    <td className="px-6 py-4"><Pill tone={statusTone(app.status)}>{app.status}</Pill></td>
                    <td className="px-6 py-4 text-xs text-neutral-400">{new Date(app.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDetailApp(app)}
                          className="px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-md"
                        >
                          View
                        </button>
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-md disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => { setRejectApp(app); setRejectReason(''); }}
                              className="px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors rounded-md"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AdminModal
        title="Application Details"
        open={!!detailApp}
        onClose={() => setDetailApp(null)}
        footer={
          detailApp?.status === 'PENDING' ? (
            <div className="flex gap-2">
              <button onClick={() => setDetailApp(null)} className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-md">
                Close
              </button>
              <button
                onClick={() => handleApprove(detailApp.id)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-sans uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-md disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => { setRejectApp(detailApp); setDetailApp(null); setRejectReason(''); }}
                className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-red-500/30 text-red-600 hover:bg-red-500/10 transition-colors rounded-md"
              >
                Reject
              </button>
            </div>
          ) : (
            <button onClick={() => setDetailApp(null)} className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-md">
              Close
            </button>
          )
        }
      >
        {detailApp && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Name</div>
                <div className="font-medium">{detailApp.fullName}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Email</div>
                <div>{detailApp.userEmail}</div>
              </div>
            </div>
            {detailApp.bio && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Bio</div>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{detailApp.bio}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Experience</div>
              <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{detailApp.experience}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Motivation</div>
              <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{detailApp.motivation}</div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <Pill tone={statusTone(detailApp.status)}>{detailApp.status}</Pill>
              <span className="text-xs text-neutral-400">Applied: {new Date(detailApp.createdAt).toLocaleString('vi-VN')}</span>
              {detailApp.reviewedAt && <span className="text-xs text-neutral-400">Reviewed: {new Date(detailApp.reviewedAt).toLocaleString('vi-VN')}</span>}
            </div>
            {detailApp.status === 'REJECTED' && detailApp.rejectionReason && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-[10px] uppercase tracking-widest text-red-500 mb-1">Rejection Reason</div>
                <div className="text-sm text-red-700 dark:text-red-300">{detailApp.rejectionReason}</div>
              </div>
            )}
          </div>
        )}
      </AdminModal>

      {/* Reject Modal */}
      <AdminModal
        title="Reject Application"
        open={!!rejectApp}
        onClose={() => setRejectApp(null)}
        footer={
          <>
            <button onClick={() => setRejectApp(null)} className="px-4 py-2 text-xs font-sans uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-md">
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="px-4 py-2 text-xs font-sans uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors rounded-md disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Reject'}
            </button>
          </>
        }
      >
        {rejectApp && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Rejecting application from <strong>{rejectApp.fullName}</strong> ({rejectApp.userEmail})
            </p>
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500 mb-2">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 resize-none"
                placeholder="Provide a reason for rejection..."
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default InstructorsTab;
