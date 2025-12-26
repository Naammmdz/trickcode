import { Link } from 'react-router-dom';

const FeaturedArticle = ({ article }) => {
  const { category, categoryColor, date, title, description, link, readTime } = article;

  return (
    <article className="bg-frontier-card border border-white/10 rounded-lg p-1 hover:border-primary/40 transition-all duration-300 group shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
      <div className="bg-[#121212] rounded p-6 md:p-10 h-full relative z-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono mb-2">
            <span 
              className="px-2 py-1 rounded border shadow-[0_0_10px_rgba(249,115,22,0.2)]"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                borderColor: `${categoryColor}20`
              }}
            >
              {category}
            </span>
            <span className="text-gray-500">::</span>
            <span className="text-gray-400">{date}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white group-hover:text-primary transition-colors leading-tight">
            {title}
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
            {description}
          </p>
          <div className="pt-4 flex items-center gap-4">
            <Link 
              to={link}
              className="inline-flex items-center gap-2 text-primary hover:text-white font-mono text-sm font-bold uppercase tracking-wide transition-colors group/link"
            >
              Read_Full_Log() 
              <span className="material-symbols-outlined text-base group-hover/link:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <div className="h-px w-12 bg-white/10"></div>
            <span className="text-xs text-gray-500 font-mono">{readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
