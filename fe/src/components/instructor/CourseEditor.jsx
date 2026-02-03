import { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import LessonEditor from './LessonEditor';

const CourseEditor = ({ courseId, onBack }) => {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        price: 0,
        thumbnailUrl: '',
        level: 'BEGINNER',
        status: 'DRAFT'
    });

    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState([]);

    // Lesson Editor State
    const [editingLesson, setEditingLesson] = useState(null); // { sectionId, lessonId }
    const [isLessonEditorOpen, setIsLessonEditorOpen] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState(null); // For creating new lesson in a section

    const loadData = async () => {
        if (!courseId) return;
        try {
            setLoading(true);
            const data = await courseService.getCourseCurriculum(courseId);
            setCourse(data);
            setSections(data.sections || []);
        } catch (error) {
            console.error('Failed to load course', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            loadData();
        }
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveCourse = async () => {
        try {
            if (courseId) {
                await courseService.updateCourse(courseId, course);
                loadData(); // Reload to get potential server-side updates
            } else {
                const newCourse = await courseService.createCourse(course);
                // If created, maybe we should switch mode or notify
                onBack(); // Simply go back for now
            }
        } catch (error) {
            alert('Failed to save course');
        }
    };

    const handleAddSection = async () => {
        const title = prompt('Enter section title:');
        if (!title) return;

        try {
            await courseService.createSection({
                title,
                course: { id: courseId },
                orderIndex: sections.length + 1
            });
            loadData();
        } catch (error) {
            alert('Failed to add section');
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!confirm('Delete this section and all its lessons?')) return;
        try {
            await courseService.deleteSection(sectionId);
            loadData();
        } catch (error) {
            alert('Failed to delete section');
        }
    };

    const handleOpenLessonEditor = (sectionId, lessonId = null) => {
        setActiveSectionId(sectionId);
        setEditingLesson(lessonId);
        setIsLessonEditorOpen(true);
    };

    const handleLessonSaved = () => {
        setIsLessonEditorOpen(false);
        setEditingLesson(null);
        setActiveSectionId(null);
        loadData();
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!confirm('Delete this lesson?')) return;
        try {
            await courseService.deleteLesson(lessonId);
            loadData();
        } catch (error) {
            alert('Failed to delete lesson');
        }
    };

    if (isLessonEditorOpen) {
        return (
            <LessonEditor
                courseId={courseId}
                sectionId={activeSectionId}
                lessonId={editingLesson}
                onSave={handleLessonSaved}
                onCancel={() => setIsLessonEditorOpen(false)}
            />
        );
    }

    return (
        <div className="p-8 max-w-6xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-neutral-500">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-2xl font-serif text-neutral-900 dark:text-white">
                            {courseId ? 'Edit Course' : 'Create New Course'}
                        </h2>
                        <p className="text-sm text-neutral-500">Basic information and curriculum.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveCourse}
                        className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Save Content
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-4">
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Basic Information</h3>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Course Title</label>
                            <input
                                name="title"
                                value={course.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={course.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Price ($)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={course.price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Level</label>
                                <select
                                    name="level"
                                    value={course.level}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-medium text-neutral-900 dark:text-white">Curriculum</h3>
                            <button
                                onClick={handleAddSection}
                                disabled={!courseId} // Must enable course first
                                className="text-xs font-bold uppercase text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={!courseId ? "Save course to add sections" : ""}
                            >
                                + Add Section
                            </button>
                        </div>

                        {!courseId ? (
                            <div className="text-center py-8 text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                                Please save the course details first to start adding curriculum.
                            </div>
                        ) : sections.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                                No sections yet. Add a section to get started.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sections.map((section, idx) => (
                                    <div key={section.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                                        <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-neutral-500 font-mono">#{idx + 1}</span>
                                                <span className="text-sm font-medium text-neutral-900 dark:text-white">{section.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenLessonEditor(section.id)}
                                                    className="text-xs uppercase font-bold text-neutral-600 dark:text-neutral-400 hover:text-primary mr-2"
                                                >
                                                    + Lesson
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSection(section.id)}
                                                    className="text-neutral-400 hover:text-red-500"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                            {section.lessons && section.lessons.length > 0 ? (
                                                section.lessons.map(lesson => (
                                                    <div key={lesson.id} className="px-4 py-3 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-neutral-400 text-sm">
                                                                {lesson.type === 'VIDEO' ? 'play_circle' :
                                                                    lesson.type === 'QUIZ' ? 'quiz' :
                                                                        lesson.type === 'CODE' ? 'code' : 'article'}
                                                            </span>
                                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">{lesson.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 opactiy-0 group-hover:opacity-100">
                                                            <button
                                                                onClick={() => handleOpenLessonEditor(section.id, lesson.id)}
                                                                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                                className="p-1 text-neutral-400 hover:text-red-500"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-xs text-neutral-400 italic text-center">
                                                    No lessons in this section
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6">
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Thumbnail</h3>
                        <div className="mb-4 aspect-video bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
                            {course.thumbnailUrl ? (
                                <img src={course.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Image URL</label>
                            <input
                                name="thumbnailUrl"
                                value={course.thumbnailUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseEditor;
