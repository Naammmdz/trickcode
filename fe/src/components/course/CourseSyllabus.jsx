import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { courseService } from '../../services/courseService';

const CourseSyllabus = ({ courseId }) => {
  const location = useLocation();
  const [curriculum, setCurriculum] = useState(null);
  const [progress, setProgress] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const isReviewMode = location.state?.isReviewMode || false;

  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const [data, progressData] = await Promise.all([
          courseService.getCourseCurriculum(courseId),
          !isReviewMode ? courseService.getCourseProgress(courseId) : Promise.resolve(null)
        ]);

        setCurriculum(data);
        setProgress(progressData);
        // Auto-expand first section
        if (data.sections && data.sections.length > 0) {
          setExpandedSections([data.sections[0].id]);
        }
      } catch (error) {
        console.error('Error loading curriculum:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurriculum();
  }, [courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLessonIcon = (lessonType) => {
    const type = lessonType?.toLowerCase();
    switch (type) {
      case 'video':
        return 'play_circle';
      case 'quiz':
        return 'quiz';
      case 'code':
        return 'code';
      case 'text':
        return 'article';
      default:
        return 'radio_button_unchecked';
    }
  };

  const getLessonRoute = (lesson) => {
    const type = lesson.type?.toLowerCase();
    const baseRoute = isReviewMode ? `/admin/review/${courseId}` : `/my-courses/${courseId}`;

    if (type === 'quiz') {
      return `${baseRoute}/quiz/${lesson.id}`;
    } else if (type === 'code') {
      return `${baseRoute}/code/${lesson.id}`;
    } else {
      return `${baseRoute}/lesson/${lesson.id}`;
    }
  };

  const isLessonActive = (lesson) => {
    const route = getLessonRoute(lesson);
    return location.pathname === route;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (loading || !curriculum) {
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

  // Calculate progress
  const totalLessons = curriculum.sections?.reduce((acc, section) =>
    acc + (section.lessons?.length || 0), 0) || 0;

  return (
    <aside className="w-80 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm flex flex-col hidden lg:flex">
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-2">Course Syllabus</h2>
        <h3 className="font-serif font-medium text-lg leading-tight mb-3">{curriculum.title}</h3>
        <div className="flex justify-between items-center text-[10px] font-sans text-neutral-400">
          <span>{totalLessons} Lessons</span>
          {progress && !isReviewMode && (
            <span className="text-orange-500 font-medium">
              {progress.completedLessons} / {progress.totalLessons} Completed ({progress.progressPercent}%)
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {curriculum.sections?.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          return (
            <details
              key={section.id}
              className="border-b border-neutral-200 dark:border-neutral-800 group"
              open={isExpanded}
            >
              <summary
                className="w-full px-5 py-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer select-none sticky top-0 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSection(section.id);
                }}
              >
                <span className={`text-xs font-sans uppercase tracking-widest ${isExpanded ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'
                  }`}>
                  {String(section.orderIndex || 0).padStart(2, '0')}. {section.title}
                </span>
                <span
                  className="material-symbols-outlined text-neutral-400 text-sm transition-transform"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </summary>
              <div className="bg-white dark:bg-neutral-900/30">
                {section.lessons?.map((lesson) => {
                  const isActive = isLessonActive(lesson);
                  const lessonRoute = getLessonRoute(lesson);
                  const isCompleted = progress?.completedLessonIds?.includes(lesson.id) && !isReviewMode;

                  return (
                    <Link
                      key={lesson.id}
                      to={lessonRoute}
                      state={isReviewMode ? { reviewMode: true } : undefined}
                      className={`flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-l-2 ${isActive ? 'border-orange-500 bg-white dark:bg-neutral-900' : 'border-transparent'
                        }`}
                    >
                      {isActive ? (
                        <div className="relative flex items-center justify-center w-3.5 h-3.5 mt-0.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </div>
                      ) : isCompleted ? (
                        <div className="relative flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        </div>
                      ) : (
                        <span
                          className="material-symbols-outlined text-neutral-400 text-[16px] mt-0.5"
                        >
                          {getLessonIcon(lesson.type)}
                        </span>
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium leading-snug ${isActive ? 'text-neutral-900 dark:text-white' : isCompleted ? 'text-neutral-500 line-through dark:text-neutral-400' : 'text-neutral-600 dark:text-neutral-300'
                          }`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`material-symbols-outlined text-[10px] ${isActive ? "text-orange-500" : isCompleted ? "text-green-500/70" : "text-neutral-400"
                            }`}>
                            {getLessonIcon(lesson.type)}
                          </span>
                          <span className={`text-[10px] font-sans uppercase tracking-widest ${isActive ? "text-orange-500" : isCompleted ? "text-green-500/70" : "text-neutral-400"
                            }`}>
                            {lesson.type}
                            {lesson.durationSeconds && ` · ${formatDuration(lesson.durationSeconds)}`}
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
