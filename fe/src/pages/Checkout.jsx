import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import ThemeToggler from '../components/ui/ThemeToggler';
import { courseService } from '../services/courseService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const courseId = searchParams.get('courseId');
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [bankCode, setBankCode] = useState(null); // VNPAYQR | VNBANK | INTCARD | NCB | null

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

    // Wait for auth check to complete before redirecting
    if (authLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      navigate(`/login?redirect=/checkout?courseId=${courseId}`);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user, navigate, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double check authentication before processing payment
    if (!user) {
      setError('Please login to continue with payment');
      navigate(`/login?redirect=/checkout?courseId=${courseId}`);
      return;
    }
    
    if (!courseId) {
      setError('Course ID is required');
      return;
    }

    if (paymentMethod === 'vnpay') {
      try {
        setProcessing(true);
        setError(null);
        
        const result = await paymentService.createVnPayPayment(parseInt(courseId), bankCode);

        console.group('[VNPay] create payment result');
        console.log('courseId:', courseId);
        console.log('orderId:', result?.orderId);
        console.log('txnRef:', result?.txnRef);
        console.log('paymentUrl:', result?.paymentUrl);
        if (result?.paymentUrl) {
          try {
            const url = new URL(result.paymentUrl);
            console.log('paymentUrl host:', url.host);
            console.log('paymentUrl params:');
            for (const [k, v] of url.searchParams.entries()) {
              if (k === 'vnp_SecureHash') {
                console.log(k + ':', v?.slice(0, 12) + '...');
              } else {
                console.log(k + ':', v);
              }
            }
          } catch (e) {
            console.warn('Failed to parse paymentUrl:', e);
          }
        }
        console.groupEnd();
        
        // Redirect to VNPay payment page
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          setError('Failed to create payment URL');
        }
      } catch (err) {
        console.error('Payment creation failed:', err);
        setError(err.message || 'Failed to create payment. Please try again.');
        setProcessing(false);
      }
    } else {
      setError('Only VNPay payment is currently supported');
    }
  };

  // Show loading while checking auth or fetching course
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">
            {authLoading ? 'Checking authentication...' : 'Loading checkout...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link to="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const coursePrice = course?.price || 0;
  const originalPrice = course?.originalPrice || coursePrice;
  const discount = originalPrice > coursePrice ? originalPrice - coursePrice : 0;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <img
                alt="TrickCode Logo"
                className="w-full h-full object-contain rounded"
                src={logo}
              />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-sans text-neutral-500 dark:text-neutral-400">
              <span className="material-symbols-outlined text-sm">lock</span>
              Secure Checkout
            </span>
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900 dark:text-white">Checkout</h1>
                <p className="text-neutral-500 dark:text-neutral-400 font-light">Complete your purchase securely.</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit}>
                {/* Payment Method */}
                <section>
                  <h2 className="text-lg font-serif font-medium mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-sans">1</span>
                    Payment Method
                  </h2>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1">
                      <input 
                        checked={paymentMethod === 'vnpay'} 
                        className="hidden" 
                        id="vnpay" 
                        name="payment-method" 
                        type="radio"
                        onChange={() => setPaymentMethod('vnpay')}
                      />
                      <label 
                        className={`block text-center border py-4 px-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'vnpay'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                        htmlFor="vnpay"
                      >
                        <span className="material-symbols-outlined mb-2">account_balance</span>
                        <span className="block text-xs font-sans uppercase tracking-widest">VNPay</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border border-neutral-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">VNPay Channel</span>
                      <span className="text-[10px] font-sans text-neutral-400">Optional</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBankCode(null)}
                        className={`p-3 border rounded text-left transition-colors ${
                          bankCode === null
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="text-xs font-sans uppercase tracking-widest font-bold">Auto</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Choose on VNPay</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBankCode('VNPAYQR')}
                        className={`p-3 border rounded text-left transition-colors ${
                          bankCode === 'VNPAYQR'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="text-xs font-sans uppercase tracking-widest font-bold">QR</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">VNPAYQR</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBankCode('VNBANK')}
                        className={`p-3 border rounded text-left transition-colors ${
                          bankCode === 'VNBANK'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="text-xs font-sans uppercase tracking-widest font-bold">ATM</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">VNBANK</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBankCode('INTCARD')}
                        className={`p-3 border rounded text-left transition-colors ${
                          bankCode === 'INTCARD'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="text-xs font-sans uppercase tracking-widest font-bold">Card</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">INTCARD</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBankCode('NCB')}
                        className={`p-3 border rounded text-left transition-colors md:col-span-2 ${
                          bankCode === 'NCB'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="text-xs font-sans uppercase tracking-widest font-bold">Test Bank</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">NCB (test card)</div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-center md:justify-start pt-4 opacity-60 grayscale">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span className="text-[10px] font-sans uppercase tracking-widest">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">verified_user</span>
                      <span className="text-[10px] font-sans uppercase tracking-widest">Secure Checkout</span>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-900 dark:border-neutral-100 p-8 rounded-lg shadow-2xl shadow-neutral-200 dark:shadow-none relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900 dark:bg-white"></div>
                  <h3 className="text-xl font-serif mb-8">Order Summary</h3>
                  
                  {course && (
                    <>
                      <div className="flex gap-4 mb-8">
                        <div className="w-20 h-20 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                          {course.imageUrl ? (
                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif font-medium text-lg leading-tight mb-1">{course.title}</h4>
                          <p className="text-xs font-sans text-neutral-500 mb-2">{course.description?.substring(0, 50)}...</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 tracking-wider">
                            Lifetime Access
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800 mb-8">
                        {originalPrice > coursePrice && (
                          <>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-neutral-600 dark:text-neutral-400">Original Price</span>
                              <span className="font-sans line-through text-neutral-400">${originalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-primary">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">local_offer</span>
                                Discount
                              </span>
                              <span className="font-sans">-${discount.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-neutral-600 dark:text-neutral-400">Taxes</span>
                          <span className="font-sans text-neutral-400">$0.00</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-6 border-t border-neutral-200 dark:border-neutral-700 mb-8">
                        <span className="font-serif text-lg">Total</span>
                        <div className="text-right">
                          <span className="block text-3xl font-serif font-bold">${coursePrice.toFixed(2)}</span>
                          <span className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest">USD</span>
                        </div>
                      </div>
                    </>
                  )}

                  <button 
                    type="submit"
                    form="checkout-form"
                    disabled={processing || !course}
                    className="w-full group bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-5 px-6 flex items-center justify-between hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg shadow-neutral-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <span className="font-sans text-xs uppercase tracking-widest font-bold">Processing...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-neutral-900"></div>
                      </>
                    ) : (
                      <>
                        <span className="font-sans text-xs uppercase tracking-widest font-bold">Complete Purchase</span>
                        <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      By completing your purchase, you agree to our <a className="underline hover:text-neutral-900 dark:hover:text-white" href="#">Terms of Service</a> and <a className="underline hover:text-neutral-900 dark:hover:text-white" href="#">Privacy Policy</a>.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-neutral-500">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span className="text-xs font-medium">30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              alt="TrickCode Logo"
              className="w-6 h-6 object-contain rounded"
              src={logo}
            />
            <span className="font-serif font-bold text-lg tracking-tight text-neutral-900 dark:text-white">Trickcode</span>
          </div>
          <div className="text-[10px] font-sans uppercase text-neutral-400 tracking-widest">
            © 2024 Trickcode Inc. All rights reserved.
          </div>
          <div className="flex gap-6 opacity-60">
            <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
