const NewsDetailComments = () => {
  const comments = [
    {
      id: 1,
      username: 'sarah_dev',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmn8pelnBd3ei6CACHWsKoSNEo14uF3Ou4grWF3PyNsNCCN_elc-5oBXxHxBPIIk8vHrrmMIP9jwtgSlYPeTf_VwpsDKwuwkk5_IzAPl1dXHd9LrTGjoHhsq1tNnkU2o_XlcHBpphajIR__79yvffnWK6jbYin4UQSbdAT50j3mvFCDskmylpfQwRXoEC5jqpW7p4-spe8wHU-JUqi6sa7zuN13FNq1c3fMgc5Ey4pT7R3e00OAxgkHFhCZ70pO8ifFW7sZ7RjBOde',
      time: '2h ago',
      text: 'The memory visualization is a game changer! Finally passed the difficult DP problem on the leaderboard thanks to seeing the cache hits.'
    },
    {
      id: 2,
      username: 'rust_evangelist',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkO5OTkani_ZDcbVm5-mELmzRktcTBC2nJCUlsvpNKGq5Dp9-hNXIfxFoS8XmaP3HHj5cLvWYPLdctY8A5m5CMHyyvneJAQUwofv-y62NBMaKt6Lbhz64dTvjZefA87lBzO2pc-yuFShA34nUXgDFi8W3hBrclCNyeAha6ApBmfGSrZX8BksiwtnPndOwQUyXThdbpPUXYgbcVxHYhbhCfSbOy3Fncw8vze2rMdq8WjGjQdj4pBc6R9sxzeEh3p8VeySpQNf-lQvhJ',
      time: '5h ago',
      text: 'Great to see Rust being adopted in the backend. Are you using Actix or Axum for the web server part?'
    }
  ];

  return (
    <section className="border-t border-white/10 pt-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif text-white">
          Discussion_Stream <span className="text-gray-500 font-mono text-sm ml-2">(12)</span>
        </h3>
      </div>

      {/* Comment Input */}
      <div className="bg-frontier-card border border-white/10 rounded-lg p-4 mb-8 flex gap-4">
        <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-500">person</span>
        </div>
        <div className="flex-grow">
          <textarea 
            className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-600 font-mono mb-2" 
            placeholder="Initialize a comment..." 
            rows="3"
          />
          <div className="flex justify-end">
            <button className="bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold py-2 px-4 rounded transition-colors shadow-lg shadow-primary/10">
              POST_COMMENT
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <img 
              alt="User" 
              className="w-10 h-10 rounded border border-white/10 opacity-80" 
              src={comment.avatar}
            />
            <div className="flex-grow">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-white text-sm font-bold font-mono">{comment.username}</span>
                <span className="text-gray-600 text-xs font-mono">{comment.time}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {comment.text}
              </p>
              <button className="text-gray-500 hover:text-primary text-xs font-mono mt-2 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[14px]">reply</span> Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsDetailComments;
