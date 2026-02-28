import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      courseName: 'Graph Algorithms for Production',
      courseType: 'Advanced Bundle',
      orderId: '#8839-442',
      method: { type: 'card', icon: 'credit_card', label: 'VISA **** 4242' },
      amount: 149.00
    },
    {
      id: 2,
      date: 'Sep 12, 2023',
      courseName: 'Binary Search Deep Dive',
      courseType: 'Standard License',
      orderId: '#8839-105',
      method: { type: 'card', icon: 'credit_card', label: 'VISA **** 4242' },
      amount: 89.00
    },
    {
      id: 3,
      date: 'Aug 05, 2023',
      courseName: 'Dynamic Programming Patterns',
      courseType: 'Pro Bundle',
      orderId: '#8721-993',
      method: { type: 'paypal', icon: 'paypal', label: 'PayPal' },
      amount: 249.00
    },
    {
      id: 4,
      date: 'Jul 22, 2023',
      courseName: 'Advanced System Design Interview',
      courseType: 'Workshop Access',
      orderId: '#8650-112',
      method: { type: 'card', icon: 'credit_card', label: 'VISA **** 4242' },
      amount: 299.00
    },
    {
      id: 5,
      date: 'Jun 10, 2023',
      courseName: 'Pro Membership (Annual)',
      courseType: 'Renewal',
      orderId: '#8100-554',
      method: { type: 'card', icon: 'credit_card', label: 'VISA **** 4242' },
      amount: 59.00
    }
  ];

  const totalInvested = transactions.reduce((sum, t) => sum + t.amount, 0);
  const activeLicenses = transactions.length;

  const handleDownloadInvoice = (orderId) => {
    console.log('Downloading invoice for:', orderId);
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
                  <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400">ID: 884-XJ</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 dark:text-white uppercase">
                  Transaction Logs
                </h1>
              </div>
              <div className="flex gap-12 w-full lg:w-auto border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800 pt-6 lg:pt-0">
                <div className="flex flex-col min-w-max">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1">Total Invested</span>
                  <span className="text-2xl md:text-3xl font-serif">${totalInvested.toFixed(2)}</span>
                </div>
                <div className="flex flex-col min-w-max">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1">Active Licenses</span>
                  <span className="text-2xl md:text-3xl font-serif">{activeLicenses}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-12">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-sans uppercase tracking-widest text-neutral-500">
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Date</th>
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Course Name</th>
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Order ID</th>
                        <th className="py-5 px-6 font-medium whitespace-nowrap">Method</th>
                        <th className="py-5 px-6 font-medium text-right whitespace-nowrap">Amount</th>
                        <th className="py-5 px-6 font-medium text-right whitespace-nowrap">Document</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800/50"
                        >
                          <td className="py-6 px-6 font-mono text-neutral-500 dark:text-neutral-400">{transaction.date}</td>
                          <td className="py-6 px-6">
                            <div className="font-serif text-lg text-neutral-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                              {transaction.courseName}
                            </div>
                            <div className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest">
                              {transaction.courseType}
                            </div>
                          </td>
                          <td className="py-6 px-6 font-mono text-neutral-500">{transaction.orderId}</td>
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                              {transaction.method.type === 'paypal' ? (
                                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[8px]">P</span>
                              ) : (
                                <span className="material-symbols-outlined text-lg">{transaction.method.icon}</span>
                              )}
                              {transaction.method.label}
                            </div>
                          </td>
                          <td className="py-6 px-6 text-right font-serif text-lg">${transaction.amount.toFixed(2)}</td>
                          <td className="py-6 px-6 text-right">
                            <button
                              onClick={() => handleDownloadInvoice(transaction.orderId)}
                              className="invoice-link inline-flex items-center text-[10px] font-sans uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                            >
                              Invoice
                              <span className="download-icon material-symbols-outlined text-sm">download</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-between items-center">
                  <span className="text-[10px] font-sans uppercase text-neutral-400">
                    Showing {transactions.length} of 12 Transactions
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Link
                  to="#"
                  className="text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">help</span>
                  Need help with a transaction?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-sans uppercase text-neutral-400">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img
              alt="TrickCode Logo"
              className="w-4 h-4 object-contain rounded"
              src={logo}
            />
            <span className="font-serif font-bold text-neutral-900 dark:text-white">Trickcode Inc.</span>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Support</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Log Out</Link>
          </div>
        </div>
      </footer>

      <style>{`
        .invoice-link .download-icon {
          opacity: 0;
          transform: translateY(-2px);
          transition: all 0.2s ease;
          display: inline-block;
          width: 0;
          overflow: hidden;
        }
        .invoice-link:hover .download-icon {
          opacity: 1;
          transform: translateY(0);
          width: 1.5em;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
