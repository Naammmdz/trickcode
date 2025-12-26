// Mock data - sẽ được thay thế bằng API calls sau này
export const categories = [
  { id: 'all', name: 'All Transmissions' },
  { id: 'platform', name: 'Platform Updates' },
  { id: 'tech', name: 'Tech News' },
  { id: 'community', name: 'Community Events' },
  { id: 'patch', name: 'Patch Notes' }
];

export const featuredArticle = {
  id: 'codegamy-ide-v3',
  category: 'PLATFORM UPDATE',
  categoryColor: '#F97316',
  date: '2023-10-24',
  title: 'Codegamy IDE v3.0: Engineered for Speed',
  description: 'We\'ve completely rewritten our execution engine in Rust. Experience 50% faster compile times, new memory visualization tools, and real-time collaboration with zero latency. The frontier just got faster.',
  link: '/news/codegamy-ide-v3',
  readTime: '3 min read'
};

export const articles = [
  {
    id: 1,
    category: 'Community Event',
    categoryColor: '#4ade80',
    date: '2 days ago',
    title: 'Global Hackathon: Winter Protocol',
    description: 'Registration is now open for our largest annual event. $50k in prizes and the chance to interview with top tech partners.',
    link: '#',
    linkText: 'Details'
  },
  {
    id: 2,
    category: 'Tech News',
    categoryColor: '#60a5fa',
    date: '4 days ago',
    title: 'The Rise of AI in Pair Programming',
    description: 'How LLMs are changing the landscape of technical interviews and day-to-day development workflows.',
    link: '#',
    linkText: 'Read_Article'
  },
  {
    id: 3,
    category: 'Dev Log',
    categoryColor: '#a78bfa',
    date: '1 week ago',
    title: 'Optimizing Graph Algorithms',
    description: 'A deep dive into Dijkstra vs A*. When to use which, and visualization techniques to understand the pathfinding process better.',
    link: '#',
    linkText: 'View_Analysis'
  },
  {
    id: 4,
    category: 'Platform Update',
    categoryColor: '#F97316',
    date: 'Oct 12',
    title: 'New Language Support: Mojo',
    description: 'We\'ve added experimental support for Mojo, the new programming language for AI developers. Try the "Hello World" challenge today.',
    link: '#',
    linkText: 'Start_Coding'
  }
];

// Hàm này sẽ được thay thế bằng API call trong tương lai
export const fetchArticles = async (page = 1, category = 'all', searchQuery = '') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter logic sẽ được xử lý bởi backend
  let filtered = [...articles];
  
  if (category !== 'all') {
    filtered = filtered.filter(article => 
      article.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  if (searchQuery) {
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return {
    articles: filtered,
    totalPages: 3,
    currentPage: page
  };
};
