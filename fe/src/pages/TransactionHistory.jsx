import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/orders/my-orders');
        setTransactions(response.data || []);
      } catch (err) {
        console.error('Failed to load transactions:', err);
        setError('Could not load transaction history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalInvested = transactions.reduce((sum, t) => sum + (t.priceUsd || 0), 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const formatUsd = (amount) => {
    if (amount == null) return '—';
    return '$' + Number(amount).toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-[10px] font-sans uppercase tracking-widest text-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Secure
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 dark:text-white uppercase">
                  Transaction Logs
                </h1>
              </div>
              <div className="flex gap-12 w-full lg:w-auto border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800 pt-6 lg:pt-0">
                <div className="flex flex-col min-w-max">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1">Total Invested</span>
                  <span className="text-2xl md:text-3xl font-serif">{formatUsd(totalInvested)}</span>
                </div>
                <div className="flex flex-col min-w-max">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1">Transactions</span>
                  <span className="text-2xl md:text-3xl font-serif">{transactions.length}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="lg:col-span-12">
            {loading ? (
              /* Skeleton loading */
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6 px-6 py-6 border-b border-neutral-100 dark:border-neutral-800/50 animate-pulse">
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
                      <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    </div>
                    <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-4xl text-red-400 mb-4 block">error</span>
                <p className="text-neutral-500">{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-neutral-400">receipt_long</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No transactions yet</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
                  Your purchase history will appear here after you enroll in a course or subscribe to Pro.
                </p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-colors shadow-sm hover:opacity-90"
                >
                  <span className="material-symbols-outlined text-lg">explore</span>
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-sans uppercase tracking-widest text-neutral-500">
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Date</th>
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Description</th>
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Order Ref</th>
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Method</th>
                        <th className="py-5 px-6 font-medium text-right whitespace-nowrap">Amount</th>
                        <th className="py-5 px-6 font-medium text-right whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800/50"
                        >
                          <td className="py-6 px-6 font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                            {formatDate(tx.paidAt || tx.createdAt)}
                          </td>
                          <td className="py-6 px-6">
                            <div className="font-serif text-base text-neutral-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                              {tx.courseName || 'Order #' + tx.id}
                            </div>
                            <div className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest">
                              {tx.orderType === 'SUBSCRIPTION' ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">workspace_premium</span>
                                  Pro Subscription
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">school</span>
                                  Course Purchase
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-6 px-6 font-mono text-xs text-neutral-500 whitespace-nowrap">
                            {tx.paymentTxnRef || '—'}
                          </td>
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                              <span className="material-symbols-outlined text-lg">credit_card</span>
                              {tx.paymentMethod || 'VNPay'}
                            </div>
                          </td>
                          <td className="py-6 px-6 text-right font-serif text-base whitespace-nowrap">
                            {formatUsd(tx.priceUsd)}
                          </td>
                          <td className="py-6 px-6 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-sans uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-between items-center">
                  <span className="text-[10px] font-sans uppercase text-neutral-400">
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-sans uppercase text-neutral-400">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img alt="TrickCode Logo" className="w-4 h-4 object-contain rounded" src={logo} />
            <span className="font-serif font-bold text-neutral-900 dark:text-white">Trickcode</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/marketplace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Courses</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TransactionHistory;
