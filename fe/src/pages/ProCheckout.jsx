import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import ThemeToggler from '../components/ui/ThemeToggler';
import { useAuth } from '../contexts/AuthContext';

const ProCheckout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle Pro subscription purchase
    // After successful purchase, update user.isPro = true
    console.log('Pro subscription purchase:', formData);
    // Navigate to success page or back to profile
    navigate('/profile');
  };

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
                <h1 className="text-3xl md:text-4xl font-serif mb-2 text-neutral-900 dark:text-white">Upgrade to Pro</h1>
                <p className="text-neutral-500 dark:text-neutral-400 font-light">Unlock all features and get lifetime access.</p>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit}>
                {/* Billing Information */}
                <section>
                  <h2 className="text-lg font-serif font-medium mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-sans">1</span>
                    Billing Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="firstName">First Name</label>
                      <input 
                        className="w-full bg-gray-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded" 
                        id="firstName" 
                        name="firstName"
                        placeholder="Sarah" 
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="lastName">Last Name</label>
                      <input 
                        className="w-full bg-gray-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded" 
                        id="lastName" 
                        name="lastName"
                        placeholder="Jenkins" 
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="email">Email Address</label>
                      <input 
                        className="w-full bg-gray-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded" 
                        id="email" 
                        name="email"
                        placeholder="sarah@example.com" 
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section>
                  <h2 className="text-lg font-serif font-medium mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-sans">2</span>
                    Payment Method
                  </h2>
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex-1">
                      <input 
                        checked={paymentMethod === 'card'} 
                        className="hidden" 
                        id="card" 
                        name="payment-method" 
                        type="radio"
                        onChange={() => setPaymentMethod('card')}
                      />
                      <label 
                        className={`block text-center border py-4 px-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'card'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                        htmlFor="card"
                      >
                        <span className="material-symbols-outlined mb-2">credit_card</span>
                        <span className="block text-xs font-sans uppercase tracking-widest">Card</span>
                      </label>
                    </div>
                    <div className="flex-1">
                      <input 
                        checked={paymentMethod === 'qr'} 
                        className="hidden" 
                        id="qr" 
                        name="payment-method" 
                        type="radio"
                        onChange={() => setPaymentMethod('qr')}
                      />
                      <label 
                        className={`block text-center border py-4 px-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'qr'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                        htmlFor="qr"
                      >
                        <span className="material-symbols-outlined mb-2">qr_code_scanner</span>
                        <span className="block text-xs font-sans uppercase tracking-widest">QuickPay</span>
                      </label>
                    </div>
                    <div className="flex-1">
                      <input 
                        checked={paymentMethod === 'wallet'} 
                        className="hidden" 
                        id="wallet" 
                        name="payment-method" 
                        type="radio"
                        onChange={() => setPaymentMethod('wallet')}
                      />
                      <label 
                        className={`block text-center border py-4 px-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === 'wallet'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                        htmlFor="wallet"
                      >
                        <span className="material-symbols-outlined mb-2">account_balance_wallet</span>
                        <span className="block text-xs font-sans uppercase tracking-widest">E-Wallet</span>
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-6 p-6 border border-neutral-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 rounded-lg">
                      <div className="space-y-2">
                        <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="cardNumber">Card Number</label>
                        <div className="relative">
                          <input 
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 pl-12 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded font-sans" 
                            id="cardNumber" 
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000" 
                            type="text"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                          />
                          <span className="material-symbols-outlined absolute left-3 top-3 text-neutral-400 text-lg">credit_card</span>
                          <div className="absolute right-3 top-3.5 flex gap-2 opacity-50 grayscale">
                            <span className="text-[10px] font-bold italic font-serif leading-none">VISA</span>
                            <span className="text-[10px] font-bold leading-none">MC</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="expiry">Expiry Date</label>
                          <input 
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded font-sans" 
                            id="expiry" 
                            name="expiry"
                            placeholder="MM / YY" 
                            type="text"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="cvc">CVC</label>
                          <div className="relative">
                            <input 
                              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded font-sans" 
                              id="cvc" 
                              name="cvc"
                              placeholder="123" 
                              type="text"
                              value={formData.cvc}
                              onChange={handleInputChange}
                              required
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-neutral-400 text-sm" title="Security Code">help</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-sans uppercase tracking-widest text-neutral-500" htmlFor="cardName">Name on Card</label>
                        <input 
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-shadow rounded" 
                          id="cardName" 
                          name="cardName"
                          placeholder="Sarah Jenkins" 
                          type="text"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

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
                  
                  <div className="flex gap-4 mb-8">
                    <div className="w-20 h-20 shrink-0 bg-primary/20 dark:bg-primary/30 rounded border border-primary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary">workspace_premium</span>
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-lg leading-tight mb-1">Pro Membership</h4>
                      <p className="text-xs font-sans text-neutral-500 mb-2">Annual Subscription</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans uppercase bg-primary/10 text-primary tracking-wider">
                        Lifetime Access
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Original Price</span>
                      <span className="font-sans line-through text-neutral-400">$99.99</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-primary">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">local_offer</span>
                        Discount
                      </span>
                      <span className="font-sans">-$40.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Taxes</span>
                      <span className="font-sans text-neutral-400">$0.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-6 border-t border-neutral-200 dark:border-neutral-700 mb-8">
                    <span className="font-serif text-lg">Total</span>
                    <div className="text-right">
                      <span className="block text-3xl font-serif font-bold">$59.99</span>
                      <span className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest">USD</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    form="checkout-form"
                    className="w-full group bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-5 px-6 flex items-center justify-between hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg shadow-neutral-900/20 rounded"
                  >
                    <span className="font-sans text-xs uppercase tracking-widest font-bold">Complete Purchase</span>
                    <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
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

export default ProCheckout;
