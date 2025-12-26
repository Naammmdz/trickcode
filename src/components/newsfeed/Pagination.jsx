
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageButton = (page) => {
    const isActive = page === currentPage;
    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 flex items-center justify-center rounded border transition-colors ${
          isActive
            ? 'bg-primary text-white shadow-[0_0_10px_rgba(249,115,22,0.4)] border-primary'
            : 'bg-[#121212] border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5'
        }`}
      >
        {page}
      </button>
    );
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      pages.push(renderPageButton(1));
      
      if (currentPage > 3) {
        pages.push(<span key="dots1" className="text-gray-600 px-2">...</span>);
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(renderPageButton(i));
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots2" className="text-gray-600 px-2">...</span>);
      }
      
      pages.push(renderPageButton(totalPages));
    }

    return pages;
  };

  return (
    <div className="pt-8 flex justify-center">
      <nav className="flex items-center gap-2 font-mono text-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded bg-[#121212] border border-white/10 ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:border-white/30 hover:bg-white/5'
          }`}
        >
          <span className="material-icons-outlined text-sm">chevron_left</span>
        </button>
        
        {renderPageNumbers()}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded bg-[#121212] border border-white/10 ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:border-white/30 hover:bg-white/5'
          }`}
        >
          <span className="material-icons-outlined text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
