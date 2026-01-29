
const ProblemPagination = ({ currentPage = 1, totalProblems = 2450 }) => {
  return (
    <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
      <div className="text-xs text-gray-500 font-mono">
        Showing 1-7 of {totalProblems} problems
      </div>
      
      <div className="flex gap-2 font-mono text-sm">
        <button 
          className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
          disabled
        >
          Prev
        </button>
        
        <button className="px-3 py-1.5 rounded bg-primary text-white border border-primary shadow-[0_0_10px_rgba(249,115,22,0.3)]">
          1
        </button>
        
        <button className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all">
          2
        </button>
        
        <button className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all">
          3
        </button>
        
        <span className="px-2 py-1.5 text-gray-500">...</span>
        
        <button className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all">
          Next
        </button>
      </div>
    </div>
  );
};

export default ProblemPagination;
