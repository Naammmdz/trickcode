import { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import Pagination from '../admin/common/Pagination';
import CourseEditor from './CourseEditor';

const InstructorCourses = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'edit'
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const resp = await courseService.getMyInstructorCourses({ page, size: pageSize });
            setCourses(resp.content || []);
            setTotalPages(resp.totalPages || 0);
            setTotalElements(resp.totalElements || 0);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchCourses();
        }
    }, [page, view]);

    const handleCreate = () => {
        setSelectedCourseId(null);
        setView('create');
    };

    const handleEdit = (courseId) => {
        setSelectedCourseId(courseId);
        setView('edit');
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                await courseService.deleteCourse(courseId);
                fetchCourses();
            } catch (error) {
                alert('Failed to delete course');
            }
        }
    };

    const handleSubmitForReview = async (courseId) => {
        if (!window.confirm('Submit this course for admin review? You won\'t be able to edit it while it\'s under review.')) return;
        try {
            await courseService.submitCourseForReview(courseId);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit course for review');
        }
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedCourseId(null);
    };

    if (view === 'create' || view === 'edit') {
        return (
            <CourseEditor
                courseId={selectedCourseId}
                onBack={handleBackToList}
            />
        );
    }

    return (
        <div className="p-8 max-w-6xl space-y-6">
            <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-serif text-neutral-900 dark:text-white">My Courses</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Manage your courses and content.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Course
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="min-w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
                            <tr>
                                {['Course', 'Price', 'Status', 'Students', 'Created', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-500">Loading courses...</td></tr>
                            ) : courses.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-500">You haven't created any courses yet.</td></tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-neutral-200 dark:bg-neutral-800 bg-cover bg-center shrink-0"
                                                    style={{ backgroundImage: course.thumbnailUrl ? `url('${course.thumbnailUrl}')` : 'none' }}>
                                                    {!course.thumbnailUrl && <span className="material-symbols-outlined text-neutral-400 flex items-center justify-center h-full">image</span>}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-neutral-900 dark:text-white">{course.title}</div>
                                                    <div className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded inline-block mt-1">ID: {course.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                                            {course.price === 0 ? 'Free' : `$${course.price}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                course.status === 'PENDING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    course.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {course.status || 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {course.enrollmentCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500">
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {(course.status === 'DRAFT' || course.status === 'REJECTED') && (
                                                    <button
                                                        onClick={() => handleSubmitForReview(course.id)}
                                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                                        title="Submit for Review"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">send</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(course.id)}
                                                    className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalElements={totalElements}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default InstructorCourses;
