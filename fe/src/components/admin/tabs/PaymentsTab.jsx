import { useEffect, useState } from 'react';
import apiClient from '../../../services/api';

const PaymentsTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');
  const [q, setQ] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [total, setTotal] = useState(0);

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
          // best-effort search on paymentTxnRef
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

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Payments</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
          Orders and payment status.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-sm"
            placeholder="Search by TxnRef"
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
          />

          <select
            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-sm"
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <select
            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-sm"
            value={provider}
            onChange={(e) => {
              setPage(0);
              setProvider(e.target.value);
            }}
          >
            <option value="">All Providers</option>
            <option value="VNPAY">VNPAY</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-xs font-sans uppercase tracking-widest text-neutral-500">Orders</div>
          <div className="text-xs text-neutral-400">
            Page {page + 1} / {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-neutral-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-neutral-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Course</th>
                  <th className="text-right px-4 py-3">Amount (VND)</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Provider</th>
                  <th className="text-left px-4 py-3">TxnRef</th>
                  <th className="text-left px-4 py-3">TransactionNo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50">
                    <td className="px-4 py-3 font-mono">#{o.id}</td>
                    <td className="px-4 py-3">{o.user?.login || o.user?.email || '-'}</td>
                    <td className="px-4 py-3">{o.course?.title || '-'}</td>
                    <td className="px-4 py-3 text-right font-mono">{o.totalAmount ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-[11px] font-sans">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{o.paymentProvider || o.paymentMethod || '-'}</td>
                    <td className="px-4 py-3 font-mono text-[12px]">{o.paymentTxnRef || '-'}</td>
                    <td className="px-4 py-3 font-mono text-[12px]">{o.vnpayTransactionNo || o.transactionId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            className="px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded disabled:opacity-50"
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <div className="text-xs text-neutral-400">Total: {total}</div>
          <button
            className="px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-800 rounded disabled:opacity-50"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
