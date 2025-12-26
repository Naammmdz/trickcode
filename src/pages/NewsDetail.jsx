import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import NewsDetailComments from '../components/newsdetail/NewsDetailComments';
import NewsDetailContent from '../components/newsdetail/NewsDetailContent';
import NewsDetailHeader from '../components/newsdetail/NewsDetailHeader';
import NewsDetailSidebar from '../components/newsdetail/NewsDetailSidebar';

const NewsDetail = () => {
  return (
    <>
      <Navbar />
      
      <main className="flex-grow min-h-screen relative bg-[#0a0a0a]">
        {/* Background Effects */}
        <div className="absolute top-0 inset-x-0 h-[500px] z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-10 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/news" 
              className="inline-flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Back_to_Feed
            </Link>
            <span className="text-gray-700 text-sm">/</span>
            <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              PLATFORM_UPDATE
            </span>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Article Content */}
            <article className="lg:col-span-8">
              <NewsDetailHeader />
              <NewsDetailContent />
              <NewsDetailComments />
            </article>

            {/* Sidebar */}
            <NewsDetailSidebar />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NewsDetail;
