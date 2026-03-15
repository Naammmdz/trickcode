import { useEffect, useState } from 'react';
import Pagination from '../common/Pagination';
import apiClient from '../../../services/api';
import { adminDashboardService } from '../../../services/adminDashboardService';
import StatCard from '../dashboard/StatCard';

const statusColor = {
  COMPLETED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  FAILED: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  REFUNDED: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
};

const formatUsd = (val) => `$${(Number(val) || 0).toFixed(2)}`;

const PaymentsTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);

  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');
  const [q, setQ] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    adminDashboardService.getStats()
      .then(data => setRevenueStats(data))
      .catch(() => setRevenueStats(null));
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          size,
          sort: 'id,desc',
        };

        if (status) {
          params['status.equals'] = status;
        }
        if (provider) {
          params['paymentProvider.equals'] = provider;
        }
        if (q) {
          params['paymentTxnRef.contains'] = q;
        }

        const resp = await apiClient.get('/api/orders', { params });
        setOrders(resp.data || []);
        setTotal(parseInt(resp.headers['x-total-count'] || '0', 10));
      } catch (e) {
        console.error('PaymentsTab: failed to fetch orders', e);
        setError(e?.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, size, status, provider, q]);

  const totalPages = Math.max(1, Math.ceil(total / size));

  const activeFilterCount = [status, provider].filter(Boolean).length;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Payments & Revenue</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
          Financial overview, orders and transaction details.
        </p>
      </div>

      {/* Revenue Summary */}
      {revenueStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total Revenue"
            value={formatUsd(revenueStats.totalRevenue)}
            icon="payments"
            color="green"
            subtitle={`Course: ${formatUsd(revenueStats.courseRevenue)}`}
          />
          <StatCard
            title="Platform Revenue"
            value={formatUsd(revenueStats.platformCommission)}
            icon="account_balance"
            color="primary"
            subtitle="20% courses + 100% subscriptions"
          />
          <StatCard
            title="Instructor Payouts"
            value={formatUsd(revenueStats.instructorPayouts)}
            icon="groups"
            color="blue"
            subtitle="80% of course sales"
          />
          <StatCard
            title="Pro Subscriptions"
            value={formatUsd(revenueStats.subscriptionRevenue)}
            icon="workspace_premium"
            color="yellow"
            subtitle="monthly subscription revenue"
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-lg">search</span>
            <input
              className="pl-10 pr-3 py-2.5 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:border-transparent transition-all duration-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              placeholder="Search by TxnRef..."
              value={q}
              onChange={(e) => {
                setPage(0);
                setQ(e.target.value);
              }}
            />
          </div>

          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />

          <select
            className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all duration-200 min-w-[130px]"
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all duration-200 min-w-[130px]"
            value={provider}
            onChange={(e) => {
              setPage(0);
              setProvider(e.target.value);
            }}
          >
            <option value="">All Providers</option>
            <option value="VNPAY">VNPAY</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={() => { setStatus(''); setProvider(''); }}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Clear
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
                {['Order', 'User', 'Item', 'Type', 'Amount (USD)', 'Status', 'Provider', 'TxnRef'].map((c) => (
                  <th key={c} className={`${c === 'Amount (USD)' ? 'text-right' : 'text-left'} px-5 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 dark:border-t-neutral-500 rounded-full animate-spin" />
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-red-300 dark:text-red-700">error</span>
                      <span className="text-sm text-red-500">{error}</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">receipt_long</span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">No orders found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const isSub = o.subscriptionType != null;
                  const itemName = isSub
                    ? (o.subscriptionType || '').replace(/_/g, ' ') + ' Subscription'
                    : (o.course?.title || '-');
                  const priceUsd = isSub ? '-' : (o.course?.price != null ? formatUsd(o.course.price) : '-');
                  return (
                    <tr key={o.id} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors duration-150">
                      <td className="px-5 py-3.5 font-mono text-xs text-neutral-400 dark:text-neutral-500">#{o.id}</td>
                      <td className="px-5 py-3.5 text-sm text-neutral-800 dark:text-neutral-200">{o.user?.login || o.user?.email || '-'}</td>
                      <td className="px-5 py-3.5 text-sm text-neutral-800 dark:text-neutral-200 max-w-[200px] truncate">{itemName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border ${isSub ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'}`}>
                          {isSub ? 'Subscription' : 'Course'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm text-neutral-700 dark:text-neutral-200">{priceUsd}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide border ${statusColor[o.status] || 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-500 dark:text-neutral-400">{o.paymentProvider || o.paymentMethod || '-'}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">{o.paymentTxnRef || '-'}</td>
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
          totalElements={total}
          pageSize={size}
        />
      </div>
    </div>
  );
};

export default PaymentsTab;
