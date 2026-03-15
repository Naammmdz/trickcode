import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import logo from '/logo.png';
import ThemeToggler from '../components/ui/ThemeToggler';
import { paymentService } from '../services/paymentService';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleReturn = async () => {
      try {
        setLoading(true);
        const params = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        const response = await paymentService.handleVnPayReturn(params);
        setResult(response);
      } catch (err) {
        console.error('Failed to handle payment return:', err);
        setError(err.message || 'Failed to process payment return');
      } finally {
        setLoading(false);
      }
    };
    handleReturn();
  }, [searchParams]);

  const isSuccess = result?.signatureValid && result?.responseCode === '00' && result?.orderStatus === 'COMPLETED';
  const isPending = result?.orderStatus === 'PENDING';
  const isSubscription = result?.orderType && result.orderType !== 'COURSE';
  const proPlanParam = result?.orderType === 'INSTRUCTOR_PRO' ? '?plan=INSTRUCTOR_PRO' : '?plan=STUDENT_PRO';

  const getSubscriptionLabel = () => {
    if (result?.orderType === 'STUDENT_PRO') return 'Student Pro';
    if (result?.orderType === 'INSTRUCTOR_PRO') return 'Instructor Pro';
    return 'Pro';
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <img alt="TrickCode Logo" className="w-full h-full object-contain rounded" src={logo} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <ThemeToggler />
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Processing payment...</p>
            </div>
          ) : error ? (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">error</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">Payment Error</h1>
              <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/marketplace"
                  className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">Payment Successful!</h1>

              {/* Subscription-specific content */}
              {isSubscription ? (
                <>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Your <strong className="text-neutral-900 dark:text-white">{getSubscriptionLabel()}</strong> subscription is now active.
                    {result.orderType === 'STUDENT_PRO'
                      ? ' You can now use AI learning features in your courses.'
                      : ' You can now use AI content generation in your dashboard.'}
                  </p>
                  <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-emerald-500">workspace_premium</span>
                      <span className="text-sm font-sans uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">{getSubscriptionLabel()} Active</span>
                    </div>
                    <div className="space-y-2 text-left text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Transaction Ref:</span>
                        <span className="font-mono text-sm">{result.txnRef}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Plan:</span>
                        <span className="font-sans text-sm font-medium text-neutral-900 dark:text-white">{getSubscriptionLabel()} — Monthly</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    {result.orderType === 'STUDENT_PRO' ? (
                      <Link
                        to="/my-courses"
                        className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded"
                      >
                        Start Learning
                      </Link>
                    ) : (
                      <Link
                        to="/instructor"
                        className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded"
                      >
                        Go to Dashboard
                      </Link>
                    )}
                    <Link
                      to="/transactions"
                      className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-sans text-sm uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded"
                    >
                      View Transactions
                    </Link>
                  </div>
                </>
              ) : (
                /* Course purchase content */
                <>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Your payment has been processed successfully. You now have access to the course.
                  </p>
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Transaction Reference:</span>
                      <span className="font-mono text-sm">{result.txnRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Response Code:</span>
                      <span className="font-mono text-sm">{result.responseCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Order Status:</span>
                      <span className="font-sans text-sm font-medium text-green-600 dark:text-green-400">{result.orderStatus}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Link
                      to="/my-courses"
                      className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded"
                    >
                      View My Courses
                    </Link>
                    <Link
                      to="/marketplace"
                      className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-sans text-sm uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors rounded"
                    >
                      Browse More Courses
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : isPending ? (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400">schedule</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">Payment Pending</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your payment is being processed. Please wait a moment and check your order status.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to={isSubscription ? `/checkout/pro${proPlanParam}` : "/my-courses"}
                  className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded"
                >
                  {isSubscription ? 'Check Subscription' : 'Check My Courses'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">cancel</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">Payment Failed</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {!result?.signatureValid
                  ? 'Invalid payment signature. Please contact support if you believe this is an error.'
                  : 'Your payment could not be processed. Please try again or contact support.'}
              </p>
              {result && (
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Response Code:</span>
                    <span className="font-mono text-sm">{result.responseCode}</span>
                  </div>
                  {result.orderStatus && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Order Status:</span>
                      <span className="font-sans text-sm font-medium text-red-600 dark:text-red-400">{result.orderStatus}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Link
                  to={isSubscription ? `/checkout/pro${proPlanParam}` : "/marketplace"}
                  className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-sm uppercase tracking-widest hover:opacity-90 transition-opacity rounded"
                >
                  {isSubscription ? 'Try Again' : 'Back to Marketplace'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentReturn;
