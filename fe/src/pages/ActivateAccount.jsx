import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const key = useMemo(() => searchParams.get('key') || '', [searchParams]);

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!key) {
        setStatus('error');
        setError('Missing activation key.');
        return;
      }
      try {
        setStatus('loading');
        setError('');
        await authService.activate(key);
        if (!cancelled) {
          setStatus('success');
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setError(e?.response?.data?.title || e?.message || 'Activation failed.');
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [key]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-frontier-black px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">Account Activation</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {status === 'loading' && 'Activating your account...'}
          {status === 'success' && 'Your account has been activated. You can now log in.'}
          {status === 'error' && 'We could not activate your account.'}
          {status === 'idle' && 'Preparing activation...'}
        </p>

        {status === 'error' && error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400 font-mono">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 text-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3 rounded hover:opacity-90 transition-opacity text-sm"
          >
            Go to Login
          </Link>
          <Link
            to="/signup"
            className="flex-1 text-center border border-gray-300 dark:border-white/10 text-gray-800 dark:text-gray-200 font-bold py-3 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm"
          >
            Sign up again
          </Link>
        </div>

        {key && (
          <div className="mt-6 text-[10px] text-gray-500 dark:text-gray-500 font-mono break-all">key={key}</div>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
