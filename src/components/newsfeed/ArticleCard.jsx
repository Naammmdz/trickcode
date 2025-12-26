
const ArticleCard = ({ article }) => {
  const { category, categoryColor, date, title, description, link, linkText } = article;

  return (
    <article className="bg-frontier-card border border-white/10 hover:border-white/30 p-6 rounded transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span 
          className="text-[10px] font-mono font-bold uppercase tracking-wider border px-2 py-1 rounded"
          style={{
            color: categoryColor,
            borderColor: `${categoryColor}20`,
            backgroundColor: `${categoryColor}0D`
          }}
        >
          {category}
        </span>
        <span className="text-xs font-mono text-gray-500">{date}</span>
      </div>
      <h3 
        className="text-xl font-bold text-white mb-3 transition-colors font-serif"
        style={{
          '--hover-color': categoryColor
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <a 
        className="text-sm text-white font-mono flex items-center gap-2 transition-colors border-t border-white/5 pt-4" 
        href={link}
        style={{
          '--hover-color': categoryColor
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
      >
        <span>{linkText} -&gt;</span>
      </a>
    </article>
  );
};

export default ArticleCard;
