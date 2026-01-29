import { Link } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';

const MarketplaceHome = () => {

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <img
                alt="TrickCode Logo"
                className="w-full h-full object-contain rounded"
                src={logo}
              />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs font-sans tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          </div>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <ThemeToggler />
          </div>
        </div>
      </nav>

      {/* Header/Hero */}
      <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 px-6 z-10 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-primary/20 bg-primary/5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-sans text-primary">400+ New Courses Available</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-8 text-neutral-900 dark:text-white">
            Master <span className="italic font-light text-neutral-600 dark:text-neutral-400">Data Structures</span><br/>
            and <span className="italic font-light text-neutral-600 dark:text-neutral-400">Algorithms</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Learn from top engineers and ace your technical interviews. Comprehensive DSA courses designed for real-world problem solving.
          </p>
          <div className="relative max-w-xl mx-auto mb-12 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
              <span className="material-symbols-outlined text-neutral-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              className="block w-full p-4 pl-12 pr-24 text-sm font-sans text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white placeholder-neutral-400 shadow-sm rounded" 
              placeholder="Search courses (e.g. 'Dynamic Programming', 'Binary Search')..." 
              type="text"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 z-10">
              <button className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[10px] uppercase font-sans tracking-widest text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors rounded">
                Find
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 opacity-80">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-300 dark:bg-neutral-600"></div>
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-400 dark:bg-neutral-500"></div>
            </div>
            <span className="text-xs font-sans text-neutral-500 dark:text-neutral-400">Joined by 10,000+ Students</span>
          </div>
        </div>
      </header>

      {/* Featured Protocols */}
      <section className="py-24 px-6 relative z-10 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Editor's Choice</h2>
              <h3 className="text-4xl font-serif text-neutral-900 dark:text-white">Featured Courses</h3>
            </div>
            <Link to="/marketplace" className="hidden md:flex items-center gap-2 text-xs font-sans hover:text-neutral-900 dark:hover:text-white transition-colors">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-500 transition-colors flex flex-col h-full rounded">
              <div className="h-48 bg-gray-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative rounded-t">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" style={{ backgroundSize: '40px 40px' }}></div>
                <span className="font-serif text-6xl text-neutral-200 dark:text-neutral-800 italic group-hover:scale-110 transition-transform duration-500">O(log n)</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono uppercase tracking-widest rounded">Algorithms</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs font-mono">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                  </div>
                </div>
                <h4 className="text-xl font-serif mb-2 group-hover:underline decoration-1 underline-offset-4">Binary Search Deep Dive</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 line-clamp-2">Master the art of divide and conquer. From basic implementation to rotated arrays and answer space search.</p>
                <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">Dr. A. Chen</span>
                  </div>
                  <span className="font-serif text-lg">$24.99</span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-500 transition-colors flex flex-col h-full rounded">
              <div className="h-48 bg-gray-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative rounded-t">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" style={{ backgroundSize: '40px 40px' }}></div>
                <span className="font-serif text-6xl text-neutral-200 dark:text-neutral-800 italic group-hover:scale-110 transition-transform duration-500">DP[]</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono uppercase tracking-widest rounded">Advanced</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs font-mono">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
                  </div>
                </div>
                <h4 className="text-xl font-serif mb-2 group-hover:underline decoration-1 underline-offset-4">Dynamic Programming Patterns</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 line-clamp-2">Stop guessing. Learn the 5 underlying patterns that solve 90% of DP problems in interviews.</p>
                <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">Sarah J.</span>
                  </div>
                  <span className="font-serif text-lg">$39.99</span>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-500 transition-colors flex flex-col h-full rounded">
              <div className="h-48 bg-gray-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative rounded-t">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" style={{ backgroundSize: '40px 40px' }}></div>
                <span className="font-serif text-6xl text-neutral-200 dark:text-neutral-800 italic group-hover:scale-110 transition-transform duration-500">G(V,E)</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono uppercase tracking-widest rounded">Graph Theory</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs font-mono">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 5.0
                  </div>
                </div>
                <h4 className="text-xl font-serif mb-2 group-hover:underline decoration-1 underline-offset-4">Graph Algorithms for Production</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 line-clamp-2">Beyond BFS/DFS. Network flow, topological sorting, and real-world routing engine architecture.</p>
                <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">M. Roberts</span>
                  </div>
                  <span className="font-serif text-lg">$34.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Roadmaps */}
      <section id="roadmaps" className="py-24 px-6 bg-gray-50 dark:bg-neutral-950/30 relative z-10 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Curated Journeys</h2>
            <h3 className="text-4xl font-serif text-neutral-900 dark:text-white">Learning Paths</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 hover:border-primary/50 transition-colors rounded">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl leading-none select-none">01</div>
              <h4 className="text-2xl font-serif mb-2">From Zero to FAANG</h4>
              <p className="text-sm text-neutral-500 mb-6 font-sans max-w-sm">A comprehensive 6-month learning path covering all major patterns required for top tech company interviews.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono border border-neutral-200 dark:border-neutral-700">1</div>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Data Structures</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono border border-neutral-200 dark:border-neutral-700">2</div>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Algorithms</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-mono">3</div>
                  <div className="h-px flex-1 bg-primary"></div>
                  <span className="text-xs font-mono uppercase text-primary">System Design</span>
                </div>
              </div>
              <Link to="/marketplace" className="inline-block text-xs font-sans border-b border-neutral-900 dark:border-white pb-1 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors">
                Start Path
              </Link>
            </div>
            <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 hover:border-primary/50 transition-colors rounded">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl leading-none select-none">02</div>
              <h4 className="text-2xl font-serif mb-2">Competitive Programming Track</h4>
              <p className="text-sm text-neutral-500 mb-6 font-sans max-w-sm">Master advanced techniques for competitive programming. Perfect for Codeforces, ICPC, and serious problem solvers.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono border border-neutral-200 dark:border-neutral-700">1</div>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Number Theory</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono border border-neutral-200 dark:border-neutral-700">2</div>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Segment Trees</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-mono">3</div>
                  <div className="h-px flex-1 bg-primary"></div>
                  <span className="text-xs font-mono uppercase text-primary">Flow Networks</span>
                </div>
              </div>
              <Link to="/marketplace" className="inline-block text-xs font-sans border-b border-neutral-900 dark:border-white pb-1 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-600 dark:hover:border-neutral-300 transition-colors">
                Start Path
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Engineers */}
      <section id="mentors" className="py-24 px-6 relative z-10 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Expertise</h2>
              <h3 className="text-4xl font-serif text-neutral-900 dark:text-white">Lead Engineers</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Dr. Alex Chen', role: 'Ex-Google Staff Eng', tags: ['Algorithms', 'Java'] },
              { name: 'Sarah Jenkins', role: 'Principal @ Stripe', tags: ['System Design', 'Ruby'] },
              { name: 'Marcus Roberts', role: 'Competitive Programmer', tags: ['C++', 'Math'] },
              { name: 'Elena Vo', role: 'Netflix Core Team', tags: ['Microservices', 'Go'] },
            ].map((instructor, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full p-1 border border-neutral-200 dark:border-neutral-700 group-hover:border-primary transition-colors">
                  <div className="w-full h-full rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                </div>
                <h4 className="text-lg font-serif mb-1">{instructor.name}</h4>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">{instructor.role}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {instructor.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="text-[10px] px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded bg-gray-50 dark:bg-neutral-950">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Domain */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">Explore by Domain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'dns', title: 'Backend Devs', desc: '"Optimize this database query"', content: 'System Design & Scaling' },
              { icon: 'web', title: 'Frontend Devs', desc: '"Implement a virtual DOM"', content: 'DOM & State Management' },
              { icon: 'psychology', title: 'Founders', desc: '"What technical problem are you solving?"', content: 'Architecture & Trade-offs' },
            ].map((domain, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded cursor-pointer group">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">{domain.icon}</span>
                  <span className="text-xs font-mono uppercase tracking-widest">{domain.title}</span>
                </div>
                <p className="text-sm text-neutral-500 mb-6 font-mono">{domain.desc}</p>
                <div className="bg-gray-50 dark:bg-neutral-950 p-4 rounded text-xs font-mono text-neutral-400 border border-neutral-100 dark:border-neutral-800 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block mb-2 text-2xl opacity-20">
                      {idx === 0 ? '< >' : idx === 1 ? '{ }' : '#'}
                    </span>
                    {domain.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Access / Pricing */}
      <section className="py-24 px-6 relative z-10 bg-gray-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif text-center mb-20">Marketplace Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 flex flex-col rounded">
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Pay Per Course</h3>
                <p className="text-4xl font-serif">A La Carte</p>
              </div>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                Buy exactly what you need. Own the content forever with lifetime updates from the author.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                {['Lifetime Access', 'Direct Q&A with Author', 'Downloadable Resources'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    <span className="material-symbols-outlined text-sm">check</span> {feature}
                  </li>
                ))}
              </ul>
              <Link to="/marketplace" className="w-full block text-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans py-4 hover:opacity-90 transition-opacity rounded">
                Explore Courses
              </Link>
            </div>
            <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-8 flex flex-col relative overflow-hidden rounded">
              <div className="absolute top-4 right-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[10px] font-mono px-2 py-1 uppercase border border-neutral-200 dark:border-neutral-700 rounded">
                Pro Pass
              </div>
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest opacity-70 mb-2">Subscription</h3>
                <p className="text-4xl font-serif flex items-baseline gap-1">
                  $29 <span className="text-lg font-sans opacity-70">/mo</span>
                </p>
              </div>
              <p className="text-sm opacity-70 mb-8 leading-relaxed">
                Unlock the entire library. Perfect for intense interview preparation sprints.
              </p>
              <ul className="space-y-4 mb-8 flex-1">
                {['All 400+ Courses', 'AI Code Reviews', 'Mock Interview Credits', 'Early Access to New Courses'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-mono">
                    <span className="material-symbols-outlined text-primary text-sm">bolt</span> {feature}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="w-full block text-center bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono uppercase py-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors rounded">
                Get Pro Pass
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif max-w-lg mb-8 md:mb-0">
            Ready to master <span className="italic font-light">algorithms and ace your interviews?</span>
          </h2>
          <Link to="/login" className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors rounded">
            Join Marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white">
              <img
                alt="TrickCode Logo"
                className="w-6 h-6 object-contain rounded"
                src={logo}
              />
              <span className="font-serif font-bold text-lg">Trickcode</span>
            </div>
              <p className="max-w-xs leading-relaxed">
              The premier platform for learning data structures and algorithms. Master DSA and ace your technical interviews.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono uppercase text-neutral-900 dark:text-white mb-2">Marketplace</span>
            <Link to="/marketplace" className="hover:underline">Browse All</Link>
            <a href="#mentors" className="hover:underline">Instructors</a>
            <a href="#" className="hover:underline">Become a Mentor</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono uppercase text-neutral-900 dark:text-white mb-2">Resources</span>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Community</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono uppercase text-neutral-900 dark:text-white mb-2">Legal</span>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between text-[10px] font-mono uppercase text-neutral-400">
          <span>© 2024 Trickcode Inc.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Twitter</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Github</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Linkedin</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceHome;
