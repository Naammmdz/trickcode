import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboardSidebar from '../components/layout/AdminDashboardSidebar';
import AdminLessonPreview from './AdminLessonPreview';
import toast from 'react-hot-toast';

const AdminCourseReview = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewLessonId, setPreviewLessonId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourseCurriculum(courseId);
            setCourse(data);
            setSections(data.sections || []);
        } catch (error) {
            console.error('Failed to load course', error);
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            loadData();
        }
    }, [courseId]);

    const handleApproveCourse = async () => {
        try {
            await courseService.approveCourse(courseId);
            toast.success('Course approved and published successfully!');
            loadData();
        } catch (err) {
            toast.error('Failed to approve course: ' + (err.message || 'Unknown error'));
        }
    };

    const handleRejectCourse = async () => {
        const reason = prompt('Please enter rejection reason:');
        if (!reason) return;
        try {
            await courseService.rejectCourse(courseId, reason);
            toast.success('Course rejected successfully.');
            loadData();
        } catch (err) {
            toast.error('Failed to reject course: ' + (err.message || 'Unknown error'));
        }
    };

    const handlePublishCourse = async () => {
        try {
            await courseService.publishCourse(courseId);
            toast.success('Course published successfully!');
            loadData();
        } catch (err) {
            toast.error('Failed to publish course: ' + (err.message || 'Unknown error'));
        }
    };

    const handleUnpublishCourse = async () => {
        try {
            await courseService.unpublishCourse(courseId);
            toast.success('Course unpublished successfully!');
            loadData();
        } catch (err) {
            toast.error('Failed to unpublish course: ' + (err.message || 'Unknown error'));
        }
    };

    if (loading) {
        return (
            <DashboardLayout SidebarComponent={AdminDashboardSidebar}>
                <div className="flex flex-col items-center justify-center h-full p-8 gap-3">
                    <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 dark:border-t-neutral-500 rounded-full animate-spin" />
                    <span className="text-sm text-neutral-400">Loading course details...</span>
                </div>
            </DashboardLayout>
        );
    }

    if (!course) {
        return (
            <DashboardLayout SidebarComponent={AdminDashboardSidebar}>
                <div className="flex flex-col items-center justify-center h-full p-8 gap-2 pb-20">
                    <span className="material-symbols-outlined text-4xl text-neutral-300">error</span>
                    <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Course not found</h2>
                    <button onClick={() => navigate('/admin', { state: { tab: 'courses' } })} className="mt-4 px-4 py-2 border rounded text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Return to Dashboard</button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout SidebarComponent={AdminDashboardSidebar}>
            <div className="p-8 max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin', { state: { tab: 'courses' } })}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-neutral-500">arrow_back</span>
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-serif text-neutral-900 dark:text-white">
                                    Review Course
                                </h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    course.status === 'PENDING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        course.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {course.status || 'DRAFT'}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">Review basic information and curriculum before publishing.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {course.status === 'PENDING' && (
                            <>
                                <button
                                    onClick={handleRejectCourse}
                                    className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/10 rounded text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Reject Course
                                </button>
                                <button
                                    onClick={handleApproveCourse}
                                    className="px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors"
                                >
                                    Approve & Publish
                                </button>
                            </>
                        )}
                        {course.status === 'PUBLISHED' && (
                            <button
                                onClick={handleUnpublishCourse}
                                className="px-4 py-2 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                Unpublish
                            </button>
                        )}
                        {(course.status === 'DRAFT' || course.status === 'REJECTED') && (
                            <button
                                onClick={handlePublishCourse}
                                className="px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors"
                            >
                                Publish Course
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-5">
                            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Basic Information</h3>

                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Course Title</label>
                                <div className="text-sm text-neutral-900 dark:text-white p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-transparent">
                                    {course.title || <span className="text-neutral-400 italic">No title provided</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Description</label>
                                <div className="text-sm text-neutral-800 dark:text-neutral-200 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded whitespace-pre-wrap leading-relaxed border border-transparent min-h-[100px]">
                                    {course.description || <span className="text-neutral-400 italic">No description provided</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Price</label>
                                    <div className="text-sm font-mono text-neutral-900 dark:text-white p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-transparent">
                                        {course.price === 0 ? <span className="text-green-600 dark:text-green-400 font-medium font-sans">Free</span> : `$${course.price}`}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Level</label>
                                    <div className="text-sm text-neutral-900 dark:text-white p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-transparent">
                                        {course.level ? course.level.charAt(0) + course.level.slice(1).toLowerCase() : 'Not set'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-medium text-neutral-900 dark:text-white">Curriculum</h3>
                                <div className="text-xs text-neutral-500">
                                    {sections.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0)} Lessons
                                </div>
                            </div>

                            {sections.length === 0 ? (
                                <div className="text-center py-8 text-neutral-500 bg-neutral-50 dark:bg-neutral-800/30 rounded border border-neutral-100 dark:border-neutral-800">
                                    No sections or lessons found.
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
                                            </div>

                                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                                {section.lessons && section.lessons.length > 0 ? (
                                                    section.lessons.map(lesson => (
                                                        <div key={lesson.id} className="px-4 py-3 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                                                            <div className="flex items-center gap-3">
                                                                <span className="material-symbols-outlined text-neutral-400 text-sm">
                                                                    {lesson.type === 'VIDEO' ? 'play_circle' :
                                                                        lesson.type === 'QUIZ' ? 'quiz' :
                                                                            lesson.type === 'CODE' ? 'code' : 'article'}
                                                                </span>
                                                                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors">{lesson.title}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setPreviewLessonId(lesson.id)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded text-xs font-medium hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">visibility</span>
                                                                Preview
                                                            </button>
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
                        {/* Thumbnail */}
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6">
                            <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Thumbnail</h3>
                            <div className="mb-4 aspect-video bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
                                {course.thumbnailUrl ? (
                                    <img src={course.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">No Image Provided</div>
                                )}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-6">
                            <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Categories</h3>
                            {!course.categories || course.categories.length === 0 ? (
                                <p className="text-sm text-neutral-400 italic pb-2">No categories selected.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {course.categories.map(cat => (
                                        <span key={cat.id} className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded text-xs">
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {course.rejectionReason && (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded p-6 mt-6">
                                <h3 className="font-medium text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    Rejection Reason
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                    {course.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {previewLessonId && (
                <AdminLessonPreview
                    lessonId={previewLessonId}
                    onClose={() => setPreviewLessonId(null)}
                />
            )}
        </DashboardLayout>
    );
};

export default AdminCourseReview;
