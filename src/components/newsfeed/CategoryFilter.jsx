
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, onReset }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
        <h3 className="text-gray-900 dark:text-white font-mono font-bold text-xs uppercase tracking-wider">
          Filter_Stream
        </h3>
        <button 
          className="text-[10px] text-gray-600 dark:text-gray-500 hover:text-primary underline transition-colors"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      <div className="space-y-1">
        {categories.map((category) => (
          <label 
            key={category.id}
            className="flex items-center gap-3 cursor-pointer group py-2 px-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-all"
          >
            <input 
              defaultChecked={category.id === selectedCategory}
              className="category-filter hidden" 
              name="category" 
              type="radio"
              onChange={() => onCategoryChange(category.id)}
            />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white text-sm font-mono transition-all">
              {category.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
