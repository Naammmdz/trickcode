import { useState } from 'react';

const SubscribeBox = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubscribe && email) {
      onSubscribe(email);
      setEmail('');
    }
  };

  return (
    <div className="bg-frontier-card border border-white/10 p-5 rounded relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
      <h4 className="text-white font-serif text-lg mb-2">Subscribe</h4>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Get weekly digests directly to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          className="w-full bg-black/30 border border-white/10 rounded text-xs p-2 text-white focus:border-primary/50 outline-none" 
          placeholder="email@addr.ess" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white rounded p-2 transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-icons-outlined text-sm">send</span>
        </button>
      </form>
    </div>
  );
};

export default SubscribeBox;
