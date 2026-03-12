import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

const CourseCurriculum = ({ courseId, isReviewMode }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [curriculum, setCurriculum] = useState(null);
  const [courseAccess, setCourseAccess] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('CourseCurriculum - isReviewMode prop:', isReviewMode);

  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseCurriculum(courseId);
        setCurriculum(data);
        
        // Check access if user is logged in
        if (user) {
          const accessData = await courseService.checkCourseAccess(courseId);
          setCourseAccess(accessData);
        }
        
        // Auto-expand first section by default
        if (data.sections && data.sections.length > 0) {
          setExpandedSections([data.sections[0].id]);
        }
      } catch (error) {
        console.error('Error loading curriculum:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCurriculum();
    }
  }, [courseId, user]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLessonIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return 'play_circle';
      case 'quiz':
        return 'quiz';
      case 'code':
      case 'coding':
        return 'code';
      case 'reading':
        return 'description';
      default:
        return 'circle';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-48 mb-4"></div>
          <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
          <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (!curriculum || !curriculum.sections || curriculum.sections.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p>No curriculum available for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {curriculum.sections.map((section, sectionIndex) => (
        <div
          key={section.id}
          className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900"
        >
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-neutral-400">
                {String(sectionIndex + 1).padStart(2, '0')}
              </span>
              <h4 className="text-base font-medium text-neutral-900 dark:text-white text-left">
                {section.title}
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500">
                {section.lessons?.length || 0} lessons
              </span>
              <span
                className={`material-symbols-outlined text-neutral-400 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </div>
          </button>

          {/* Lessons List */}
          {expandedSections.includes(section.id) && section.lessons && (
            <div className="border-t border-neutral-200 dark:border-neutral-800">
              {section.lessons.map((lesson, lessonIndex) => {
                const canAccess = isReviewMode || courseAccess?.hasAccess;
                const LessonWrapper = canAccess ? Link : 'div';
                
                // Route based on lesson type
                let lessonPath;
                const lessonType = lesson.type?.toLowerCase();
                if (isReviewMode) {
                  if (lessonType === 'quiz') {
                    lessonPath = `/admin/review/${courseId}/quiz/${lesson.id}`;
                  } else if (lessonType === 'code') {
                    lessonPath = `/admin/review/${courseId}/code/${lesson.id}`;
                  } else {
                    lessonPath = `/admin/review/${courseId}/lesson/${lesson.id}`;
                  }
                } else {
                  if (lessonType === 'quiz') {
                    lessonPath = `/my-courses/${courseId}/quiz/${lesson.id}`;
                  } else if (lessonType === 'code') {
                    lessonPath = `/my-courses/${courseId}/code/${lesson.id}`;
                  } else {
                    lessonPath = `/my-courses/${courseId}/lesson/${lesson.id}`;
                  }
                }
                
                const wrapperProps = canAccess 
                  ? { 
                      to: lessonPath,
                      state: isReviewMode ? { isReviewMode: true } : undefined
                    } 
                  : {};
                
                return (
                  <LessonWrapper
                    key={lesson.id}
                    {...wrapperProps}
                    className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 border-b last:border-b-0 border-neutral-100 dark:border-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="material-symbols-outlined text-neutral-400 text-lg">
                        {getLessonIcon(lesson.type)}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-900 dark:text-white">
                          {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {lesson.duration && (
                        <span className="text-xs text-neutral-500 font-mono">
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                      {/* Show lock icon if user doesn't have access */}
                      {!canAccess && lesson.type?.toLowerCase() === 'video' && (
                        <span className="material-symbols-outlined text-neutral-300 dark:text-neutral-600 text-sm">
                          lock
                        </span>
                      )}
                      {/* Show arrow icon if can access */}
                      {canAccess && (
                        <span className="material-symbols-outlined text-neutral-400 text-sm">
                          arrow_forward
                        </span>
                      )}
                    </div>
                  </LessonWrapper>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseCurriculum;
