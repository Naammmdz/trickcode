import { useEffect, useState } from 'react';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import ArticleCard from '../components/newsfeed/ArticleCard';
import CategoryFilter from '../components/newsfeed/CategoryFilter';
import FeaturedArticle from '../components/newsfeed/FeaturedArticle';
import NewsFeedHeader from '../components/newsfeed/NewsFeedHeader';
import Pagination from '../components/newsfeed/Pagination';
import SearchBar from '../components/newsfeed/SearchBar';
import SubscribeBox from '../components/newsfeed/SubscribeBox';
import { categories, featuredArticle, fetchArticles as fetchMockArticles } from '../data/newsData';
import { newsService } from '../services/newsService';

const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [loading, setLoading] = useState(false);

  // Fetch articles when filters change
  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery, currentPage]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const data = await newsService.getArticles(currentPage, selectedCategory, searchQuery);
      setArticles(data.articles || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error loading articles from API, using mock data:', error);
      // Fallback to mock data if API fails
      try {
        const mockData = await fetchMockArticles(currentPage, selectedCategory, searchQuery);
        setArticles(mockData.articles || []);
        setTotalPages(mockData.totalPages || 1);
      } catch (mockError) {
        console.error('Error loading mock articles:', mockError);
        setArticles([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handleCategoryReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSubscribe = async (email) => {
    try {
      await newsService.subscribe(email);
      alert('Successfully subscribed to newsletter!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error.message || 'Failed to subscribe. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col min-h-screen">
      <style>{`
        .text-glow {
            text-shadow: 0 0 20px rgba(255,255,255,0.15);
        }
        .grid-bg {
            background-size: 4rem 4rem;
            mask-image: linear-gradient(to bottom, transparent, 5%, black, 95%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, transparent, 5%, black, 95%, transparent);
        }
        
        .frontier-input {
            width: 100%;
            background-color: #ffffff;
            border: 1px solid rgba(209, 213, 219, 0.8);
            border-radius: 0.125rem;
            padding: 0.75rem;
            color: #111827;
            outline: none;
            transition: all 0.2s;
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        }
        .dark .frontier-input {
            background-color: #121212;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
        }
        .frontier-input:focus {
            border-color: rgba(249, 115, 22, 0.6);
            box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.6);
        }
        .frontier-input::placeholder {
            color: #9ca3af;
        }
        .dark .frontier-input::placeholder {
            color: #4b5563;
        }

        .category-filter:checked + span {
            color: #F97316;
            font-weight: 700;
        }
        .category-filter:checked + span::before {
            content: '>';
            margin-right: 8px;
            color: #F97316;
        }
      `}</style>
      
      <Navbar />

      <NewsFeedHeader 
        title="System"
        subtitle="Logs"
        additionalText="& Updates"
        description="Chronicles from the Codegamy frontier. Stay informed on platform upgrades, community achievements, and the latest in software engineering technology."
        isLive={true}
      />
      
      <main className="flex-grow py-12 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-[#0a0a0a] min-h-screen relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-10 lg:sticky lg:top-32 h-fit">
            <SearchBar onSearch={handleSearch} />
            
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onReset={handleCategoryReset}
            />
            
            <SubscribeBox onSubscribe={handleSubscribe} />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-primary font-mono">Loading articles...</div>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                <FeaturedArticle article={featuredArticle} />
                
                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {articles.length > 0 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}

                {articles.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-gray-600 dark:text-gray-500 font-mono">No articles found. Try adjusting your filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsFeed;
