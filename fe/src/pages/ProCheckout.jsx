import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '/logo.png';
import ThemeToggler from '../components/ui/ThemeToggler';
import { useAuth } from '../contexts/AuthContext';
import { proSubscriptionService } from '../services/proService';

const ProCheckout = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan')?.toUpperCase();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan || null);
  const [proStatus, setProStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, statusData] = await Promise.all([
          proSubscriptionService.getPlans(),
          user ? proSubscriptionService.getStatus().catch(() => null) : Promise.resolve(null),
        ]);
        setPlans(plansData.plans || []);
        setProStatus(statusData);
        if (!selectedPlan && plansData.plans?.length > 0) {
          // Auto-select based on user role
          const isInstructor = hasRole('ROLE_INSTRUCTOR');
          setSelectedPlan(isInstructor ? 'INSTRUCTOR_PRO' : 'STUDENT_PRO');
        }
      } catch (err) {
        setError('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPurchasing(true);
    setError('');
    try {
      const result = await proSubscriptionService.purchase(selectedPlan);
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
    } catch (err) {
      setError(err.message || 'Purchase failed. Please try again.');
      setPurchasing(false);
    }
  };

  const activePlan = plans.find(p => p.type === selectedPlan);

  const planConfig = {
    STUDENT_PRO: {
      icon: 'school',
      title: 'Student Pro',
      tagline: 'AI Learning Assistant',
      color: 'from-blue-500 to-cyan-500',
      features: ['💡 AI Code Hints', '❓ AI Explain Test Failures', '💬 Ask AI about Code', '💬 Ask AI about Quiz', '⚡ 5 requests/minute'],
    },
    INSTRUCTOR_PRO: {
      icon: 'cast_for_education',
      title: 'Instructor Pro',
      tagline: 'AI Content Generation',
      color: 'from-orange-500 to-amber-500',
      features: ['🤖 AI Generate Quiz', '🤖 AI Generate Code Challenges', '⚡ 5 requests/minute', '🎯 Smart content from course context'],
    },
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="text-xs font-sans uppercase tracking-widest hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800" />
            <Link to="/" className="flex items-center gap-3">
              <img alt="TrickCode Logo" className="w-11 h-11 object-contain rounded" src={logo} />
              <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-sans text-neutral-500">
              <span className="material-symbols-outlined text-sm">lock</span>
              Secure Checkout
            </span>
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif mb-3">Upgrade to <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Pro</span></h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">Unlock AI-powered features to accelerate your learning.</p>
          </div>

          {/* Active Subscription Banner */}
          {proStatus?.isPro && (
            <div className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-2xl">workspace_premium</span>
                </div>
                <div>
                  <p className="text-base font-medium text-emerald-900 dark:text-emerald-200">
                    {proStatus.planType === 'STUDENT_PRO' ? 'Student' : 'Instructor'} Pro is Active
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Expires: {new Date(proStatus.expiresAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={proStatus.planType === 'INSTRUCTOR_PRO' ? '/instructor' : '/my-courses'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  {proStatus.planType === 'INSTRUCTOR_PRO' ? 'Go to Dashboard' : 'Go to My Courses'}
                </a>
              </div>
            </div>
          )}

          {/* Plan Cards — only show when not yet Pro */}
          {!proStatus?.isPro && (() => {
            const isInstructor = hasRole('ROLE_INSTRUCTOR');
            const visiblePlans = user
              ? Object.entries(planConfig).filter(([type]) =>
                  isInstructor ? type === 'INSTRUCTOR_PRO' : type === 'STUDENT_PRO'
                )
              : Object.entries(planConfig);

            return (
              <div className={`grid gap-6 mb-12 ${visiblePlans.length === 1 ? 'max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                {visiblePlans.map(([type, config]) => {
                  const plan = plans.find(p => p.type === type);
                  const isSelected = selectedPlan === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedPlan(type)}
                      className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-neutral-900 dark:border-white shadow-xl scale-[1.02]'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-white text-2xl">{config.icon}</span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-neutral-900 dark:text-white">check_circle</span>
                        )}
                      </div>
                      <h3 className="text-xl font-serif font-medium mb-1">{config.title}</h3>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">{config.tagline}</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-serif font-bold">${plan?.priceUsd || '—'}</span>
                        <span className="text-sm text-neutral-400">/month</span>
                      </div>
                      <ul className="space-y-2">
                        {config.features.map((feature, i) => (
                          <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Purchase Button — hidden when already Pro */}
          {!proStatus?.isPro && (
            <div className="max-w-md mx-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={purchasing || !selectedPlan}
                className="w-full group bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-5 px-6 flex items-center justify-between hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg shadow-neutral-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-sans text-xs uppercase tracking-widest font-bold">
                  {purchasing ? 'Redirecting to VNPay...' : `Pay ${activePlan ? '$' + activePlan.priceUsd : ''} via VNPay`}
                </span>
                {purchasing ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                )}
              </button>

              <p className="mt-4 text-center text-[10px] text-neutral-400">
                Secure payment via VNPay. Subscription auto-activates after payment.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img alt="TrickCode Logo" className="w-6 h-6 object-contain rounded" src={logo} />
            <span className="font-serif font-bold text-lg tracking-tight">Trickcode</span>
          </div>
          <div className="text-[10px] font-sans uppercase text-neutral-400 tracking-widest">
            © 2024 Trickcode Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProCheckout;
