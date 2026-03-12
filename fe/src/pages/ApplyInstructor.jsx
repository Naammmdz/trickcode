import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import logo from '/logo.png';

const ApplyInstructor = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', bio: '', experience: '', motivation: '' });
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    if (hasRole('ROLE_INSTRUCTOR')) return;
    apiClient.get('/api/instructor-applications/my')
      .then(res => {
        if (res.status === 200 && res.data) setExisting(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-neutral-300">lock</span>
            <h1 className="text-2xl font-serif">Please log in first</h1>
            <Link to="/login" className="inline-block px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs uppercase tracking-widest font-bold rounded-lg">
              Login
            </Link>
          </div>
        </main>
        <Footer simple />
      </div>
    );
  }

  if (hasRole('ROLE_INSTRUCTOR')) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
            </div>
            <h1 className="text-3xl font-serif font-bold">You're already an Instructor!</h1>
            <p className="text-neutral-500">Head to your dashboard to manage courses.</p>
            <Link to="/instructor" className="inline-block px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs uppercase tracking-widest font-bold rounded-lg">
              Go to Dashboard
            </Link>
          </div>
        </main>
        <Footer simple />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.experience.trim() || !form.motivation.trim()) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.post('/api/instructor-applications', form);
      setExisting(res.data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    PENDING: { icon: 'schedule', color: 'amber', label: 'Pending Review', desc: 'Your application is being reviewed by our team. This usually takes 1-2 business days.' },
    APPROVED: { icon: 'check_circle', color: 'emerald', label: 'Approved!', desc: 'Congratulations! You can now access the Instructor Dashboard.' },
    REJECTED: { icon: 'cancel', color: 'red', label: 'Not Approved', desc: 'Unfortunately your application was not approved this time.' },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-neutral-600 dark:text-neutral-300">school</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-3">
              Become an <span className="bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">Instructor</span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-md mx-auto">
              Share your knowledge with thousands of learners. Apply now and start creating courses.
            </p>
          </div>

          {/* Existing application status */}
          {(existing || success) && (() => {
            const app = existing;
            const cfg = statusConfig[app?.status] || statusConfig.PENDING;
            return (
              <div className={`mb-8 p-6 rounded-xl border bg-${cfg.color}-50 dark:bg-${cfg.color}-900/10 border-${cfg.color}-200 dark:border-${cfg.color}-800`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`material-symbols-outlined text-2xl text-${cfg.color}-500`}>{cfg.icon}</span>
                  <h3 className="text-lg font-medium">{cfg.label}</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{cfg.desc}</p>
                {app?.status === 'REJECTED' && app.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300"><strong>Reason:</strong> {app.rejectionReason}</p>
                  </div>
                )}
                {app?.status === 'APPROVED' && (
                  <Link to="/instructor" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-emerald-600 text-white text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    Go to Dashboard
                  </Link>
                )}
                <div className="mt-3 text-xs text-neutral-400">
                  Applied: {new Date(app?.createdAt).toLocaleDateString('vi-VN')}
                  {app?.reviewedAt && ` · Reviewed: ${new Date(app.reviewedAt).toLocaleDateString('vi-VN')}`}
                </div>
              </div>
            );
          })()}

          {/* Form — only show if no pending/approved application */}
          {!existing?.status || existing?.status === 'REJECTED' ? (
            !success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all"
                    placeholder="Your full name"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500 mb-2">Bio / About You</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all resize-none"
                    placeholder="A brief introduction about yourself..."
                    rows={3}
                    maxLength={2000}
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500 mb-2">Teaching Experience *</label>
                  <textarea
                    value={form.experience}
                    onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all resize-none"
                    placeholder="Describe your teaching or professional experience..."
                    rows={4}
                    maxLength={2000}
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500 mb-2">Why do you want to teach? *</label>
                  <textarea
                    value={form.motivation}
                    onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all resize-none"
                    placeholder="What motivates you to become an instructor on TrickCode?"
                    rows={4}
                    maxLength={2000}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full group bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-4 px-6 flex items-center justify-between hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-sans text-xs uppercase tracking-widest font-bold">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </span>
                  {submitting ? (
                    <span className="material-symbols-outlined animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  )}
                </button>
              </form>
            )
          ) : null}
        </div>
      </main>
      <Footer simple />
    </div>
  );
};

export default ApplyInstructor;
