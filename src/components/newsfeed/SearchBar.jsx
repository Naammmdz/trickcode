
const SearchBar = ({ onSearch, placeholder = "Search keywords..." }) => {
  const handleSearch = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div>
      <label className="block text-[10px] font-mono text-primary font-bold mb-3 uppercase tracking-wider">
        // Query_Database
      </label>
      <div className="relative group">
        <input 
          className="frontier-input pl-10" 
          placeholder={placeholder} 
          type="text"
          onChange={handleSearch}
        />
        <span className="material-icons-outlined absolute left-3 top-3 text-gray-500 text-lg group-focus-within:text-primary transition-colors">
          search
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
