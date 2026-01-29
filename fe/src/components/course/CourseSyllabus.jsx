import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCourseSyllabus, getCurrentItemStatus, getItemIcon, getItemTypeLabel } from '../../data/courseSyllabus';

const CourseSyllabus = ({ courseId }) => {
  const location = useLocation();
  const [syllabus, setSyllabus] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([1]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        const data = await getCourseSyllabus(courseId);
        setSyllabus(data);
        // Auto-expand chapter containing current route
        const currentPath = location.pathname;
        const currentChapter = data.chapters.find(chapter =>
          chapter.items.some(item => 
            currentPath === item.route || 
            (item.resultRoute && currentPath === item.resultRoute) ||
            currentPath.includes(item.route.split('/').pop())
          )
        );
        if (currentChapter) {
          setExpandedChapters([currentChapter.id]);
        }
      } catch (error) {
        console.error('Error loading syllabus:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSyllabus();
  }, [courseId, location.pathname]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const getItemStatusClass = (item, currentRoute) => {
    // Check if current route matches item route or result route
    const isActiveRoute = currentRoute === item.route || 
                         (item.resultRoute && currentRoute === item.resultRoute);
    const status = isActiveRoute ? "active" : getCurrentItemStatus(currentRoute, item.route, item.status);
    
    switch (status) {
      case "completed":
        return {
          icon: "check_circle",
          iconStyle: { fontVariationSettings: "'FILL' 1" },
          iconColor: "text-primary",
          textClass: "line-through text-neutral-500",
          borderClass: "border-transparent",
          bgClass: "",
          opacity: "opacity-60"
        };
      case "active":
        return {
          icon: "radio_button_unchecked",
          iconStyle: {},
          iconColor: "text-orange-500",
          textClass: "text-neutral-900 dark:text-white",
          borderClass: "border-orange-500",
          bgClass: "bg-white dark:bg-neutral-900",
          opacity: "",
          isActive: true
        };
      case "locked":
        return {
          icon: "lock",
          iconStyle: {},
          iconColor: "text-neutral-300 dark:text-neutral-700",
          textClass: "text-neutral-400",
          borderClass: "border-transparent",
          bgClass: "",
          opacity: ""
        };
      default:
        return {
          icon: "radio_button_unchecked",
          iconStyle: {},
          iconColor: "text-neutral-300 dark:text-neutral-700",
          textClass: "text-neutral-600 dark:text-neutral-400",
          borderClass: "border-transparent",
          bgClass: "",
          opacity: ""
        };
    }
  };

  if (loading || !syllabus) {
    return (
      <aside className="w-80 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm flex flex-col hidden lg:flex">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24 mb-2"></div>
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-32 mb-3"></div>
          </div>
        </div>
      </aside>
    );
  }

  const currentRoute = location.pathname;

  return (
    <aside className="w-80 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm flex flex-col hidden lg:flex">
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-2">Course Syllabus</h2>
        <h3 className="font-serif font-medium text-lg leading-tight mb-3">{syllabus.courseTitle}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${syllabus.progress.percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-sans text-neutral-400">
          <span>{syllabus.progress.percentage}% Complete</span>
          <span>{syllabus.progress.completed}/{syllabus.progress.total} Lessons</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {syllabus.chapters.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.id);
          return (
            <details 
              key={chapter.id} 
              className="border-b border-neutral-200 dark:border-neutral-800 group"
              open={isExpanded}
            >
              <summary 
                className="w-full px-5 py-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer select-none sticky top-0 z-10"
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className={`text-xs font-sans uppercase tracking-widest ${
                  isExpanded ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'
                }`}>
                  {String(chapter.order).padStart(2, '0')}. {chapter.title}
                </span>
                <span 
                  className="material-symbols-outlined text-neutral-400 text-sm transition-transform" 
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </summary>
              <div className="bg-white dark:bg-neutral-900/30">
                {chapter.items.map((item) => {
                  const statusClass = getItemStatusClass(item, currentRoute);
                  const isActive = statusClass.isActive;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.status === "locked" ? "#" : item.route}
                      className={`flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-l-2 ${statusClass.borderClass} ${statusClass.bgClass} ${statusClass.opacity} ${
                        item.status === "locked" ? "cursor-not-allowed" : ""
                      }`}
                      onClick={(e) => {
                        if (item.status === "locked") {
                          e.preventDefault();
                        }
                      }}
                    >
                      {isActive ? (
                        <div className="relative flex items-center justify-center w-3.5 h-3.5 mt-0.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </div>
                      ) : (
                        <span 
                          className={`material-symbols-outlined ${statusClass.iconColor} text-sm mt-0.5`}
                          style={statusClass.iconStyle}
                        >
                          {statusClass.icon}
                        </span>
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium leading-snug ${statusClass.textClass}`}>
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`material-symbols-outlined text-[10px] ${
                            isActive ? "text-orange-500" : "text-neutral-400"
                          }`}>
                            {getItemIcon(item.type)}
                          </span>
                          <span className={`text-[10px] font-sans ${
                            isActive ? "text-orange-500" : "text-neutral-400"
                          }`}>
                            {currentRoute === item.resultRoute ? "RESULT" : getItemTypeLabel(item)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </aside>
  );
};

export default CourseSyllabus;
