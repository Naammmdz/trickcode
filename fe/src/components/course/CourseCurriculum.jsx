import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCourseSyllabus, getCurrentItemStatus, getItemIcon, getItemTypeLabel } from '../../data/courseSyllabus';

const CourseCurriculum = ({ courseId }) => {
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
          textClass: "line-through decoration-neutral-400",
          bgClass: "opacity-60",
          borderClass: "",
          isActive: false
        };
      case "active":
        return {
          icon: "play_circle",
          iconStyle: {},
          iconColor: "text-orange-500",
          textClass: "font-medium",
          bgClass: "bg-orange-50/50 dark:bg-orange-900/10 border-l-2 border-l-orange-500",
          borderClass: "",
          isActive: true
        };
      case "locked":
        return {
          icon: "lock",
          iconStyle: {},
          iconColor: "text-neutral-400",
          textClass: "",
          bgClass: "",
          borderClass: "",
          isActive: false
        };
      default:
        return {
          icon: getItemIcon(item.type),
          iconStyle: {},
          iconColor: "text-neutral-400",
          textClass: "",
          bgClass: "",
          borderClass: "",
          isActive: false
        };
    }
  };

  if (loading || !syllabus) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-48 mb-4"></div>
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  const currentRoute = location.pathname;

  return (
    <div className="space-y-4">
      {syllabus.chapters.map((chapter) => {
        const isExpanded = expandedChapters.includes(chapter.id);
        return (
          <details 
            key={chapter.id} 
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
            open={isExpanded}
          >
            <summary 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors select-none"
              onClick={() => toggleChapter(chapter.id)}
            >
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1 block">
                  Chapter {String(chapter.order).padStart(2, '0')}
                </span>
                <h4 className="text-lg font-medium">{chapter.title}</h4>
              </div>
              <span 
                className="material-symbols-outlined text-neutral-400 transition-transform" 
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
            </summary>
            <div className="border-t border-neutral-100 dark:border-neutral-800">
              {chapter.items.map((item, itemIndex) => {
                const statusClass = getItemStatusClass(item, currentRoute);
                const isLast = itemIndex === chapter.items.length - 1;
                
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-6 py-4 ${statusClass.bgClass} border-b ${isLast ? 'last:border-0' : 'border-neutral-100 dark:border-neutral-800'} transition-colors ${
                      !statusClass.isActive && item.status !== "locked" ? 'hover:bg-neutral-50 dark:hover:bg-neutral-800/30' : ''
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${statusClass.bgClass}`}>
                      <span 
                        className={`material-symbols-outlined ${statusClass.iconColor} text-sm ${
                          statusClass.isActive ? 'animate-pulse' : ''
                        }`}
                        style={statusClass.iconStyle}
                      >
                        {statusClass.icon}
                      </span>
                      <span className={`text-sm ${statusClass.textClass} ${statusClass.isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        {item.title}
                      </span>
                    </div>
                    {item.status === "locked" ? (
                      <button 
                        disabled
                        className="border border-neutral-200 dark:border-neutral-700 text-neutral-400 text-[10px] px-3 py-1.5 font-sans uppercase tracking-widest cursor-not-allowed"
                      >
                        Locked
                      </button>
                    ) : statusClass.isActive ? (
                      <Link 
                        to={item.route}
                        className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] px-3 py-1.5 font-sans uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Resume
                      </Link>
                    ) : (
                      <Link 
                        to={item.route}
                        className="border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[10px] px-3 py-1.5 font-sans uppercase tracking-widest transition-colors"
                      >
                        Start
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
};

export default CourseCurriculum;
