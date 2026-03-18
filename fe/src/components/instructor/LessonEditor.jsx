import { useState, useEffect, useRef, useCallback } from 'react';
import { courseService } from '../../services/courseService';
import QuizBuilder from './QuizBuilder';
import CodeBuilder from './CodeBuilder';
import toast from 'react-hot-toast';

const LessonEditor = ({ courseId, sectionId, lessonId, onSave, onCancel }) => {
    const [lesson, setLesson] = useState({
        title: '',
        description: '',
        type: 'VIDEO',
        videoUrl: '',
        markdownContent: '',
        durationSeconds: 0,
        quizConfig: '',
        codeChallengeConfig: ''
    });

    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic'); // basic, content
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (lessonId) {
            const loadLesson = async () => {
                try {
                    const data = await courseService.getLesson(lessonId);
                    setLesson(data);
                } catch (error) {
                    console.error('Failed to load lesson', error);
                }
            };
            loadLesson();
        }
    }, [lessonId]);

    // Fetch course data for AI context
    useEffect(() => {
        if (courseId) {
            courseService.getCourse(courseId)
                .then(data => setCourseData(data))
                .catch(err => console.error('Failed to load course for AI context', err));
        }
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = {
                ...lesson,
                section: { id: sectionId } // Link to section
            };

            if (lessonId) {
                await courseService.updateLesson(lessonId, payload);
            } else {
                await courseService.createLesson(payload);
            }
            toast.success(lessonId ? 'Lesson updated!' : 'Lesson created!');
            onSave();
        } catch (error) {
            toast.error('Failed to save lesson: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Content Editors
    const handleVideoUpload = useCallback(async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            setUploadError('Please select a video file (MP4, WebM, MOV, etc.)');
            return;
        }

        // Validate file size (500MB max)
        if (file.size > 500 * 1024 * 1024) {
            setUploadError('File size must be less than 500MB');
            return;
        }

        setUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        try {
            const result = await courseService.uploadVideo(file, (percent) => {
                setUploadProgress(percent);
            });

            // Set the video URL from the upload response
            setLesson(prev => ({ ...prev, videoUrl: result.videoUrl }));

            // Try to get video duration from the file
            const videoEl = document.createElement('video');
            videoEl.preload = 'metadata';
            videoEl.onloadedmetadata = () => {
                if (videoEl.duration && isFinite(videoEl.duration)) {
                    setLesson(prev => ({ ...prev, durationSeconds: Math.round(videoEl.duration) }));
                }
                URL.revokeObjectURL(videoEl.src);
            };
            videoEl.src = URL.createObjectURL(file);
        } catch (error) {
            console.error('Video upload failed:', error);
            setUploadError(error.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer?.files?.[0];
        if (file) handleVideoUpload(file);
    }, [handleVideoUpload]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const isExternalUrl = (url) => {
        return url && (url.startsWith('http://') || url.startsWith('https://'));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const renderContentEditor = () => {
        switch (lesson.type) {
            case 'VIDEO':
                return (
                    <div className="space-y-5">
                        {/* Video Upload Area */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Video File</label>

                            {/* Show current video if already uploaded */}
                            {lesson.videoUrl && !uploading && (
                                <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">check_circle</span>
                                        <div>
                                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Video uploaded</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-mono truncate max-w-[300px]">
                                                {isExternalUrl(lesson.videoUrl) ? lesson.videoUrl : lesson.videoUrl.split('/').pop()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setLesson(prev => ({ ...prev, videoUrl: '' }))}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {/* Upload progress */}
                            {uploading && (
                                <div className="mb-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                            Uploading... {uploadProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Upload error */}
                            {uploadError && (
                                <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                                    <span className="text-sm text-red-700 dark:text-red-400">{uploadError}</span>
                                </div>
                            )}

                            {/* Drop zone */}
                            {!lesson.videoUrl && !uploading && (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                                        ${dragActive
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                                            : 'border-neutral-300 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 bg-neutral-50 dark:bg-neutral-950 hover:bg-orange-50/50 dark:hover:bg-orange-950/10'
                                        }
                                    `}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleVideoUpload(file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                                            dragActive ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-neutral-200 dark:bg-neutral-800'
                                        }`}>
                                            <span className={`material-symbols-outlined text-2xl ${
                                                dragActive ? 'text-orange-500' : 'text-neutral-400'
                                            }`}>cloud_upload</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                {dragActive ? 'Drop video here' : 'Drag & drop video file here'}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                or <span className="text-orange-500 font-medium">browse files</span>
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                            MP4, WebM, MOV, AVI, MKV — Max 500MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Re-upload button when video exists */}
                            {lesson.videoUrl && !uploading && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 flex items-center gap-2 text-xs text-neutral-500 hover:text-orange-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">upload</span>
                                    Upload different video
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleVideoUpload(file);
                                            e.target.value = '';
                                        }}
                                    />
                                </button>
                            )}
                        </div>

                        {/* Fallback: manual URL input (for YouTube or external links) */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                                Or paste external URL <span className="font-normal text-neutral-400">(YouTube, Vimeo, etc.)</span>
                            </label>
                            <input
                                name="videoUrl"
                                value={isExternalUrl(lesson.videoUrl) ? lesson.videoUrl : ''}
                                onChange={(e) => setLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                                placeholder="https://www.youtube.com/watch?v=..."
                                disabled={uploading}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400 text-sm disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Video Duration (Seconds)</label>
                            <input
                                name="durationSeconds"
                                type="number"
                                value={lesson.durationSeconds || 0}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                            />
                            {lesson.durationSeconds > 0 && (
                                <p className="text-xs text-neutral-400 mt-1">
                                    ≈ {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Transcript / Notes (Markdown)</label>
                            <textarea
                                name="markdownContent"
                                value={lesson.markdownContent || ''}
                                onChange={handleChange}
                                rows={10}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400 font-mono text-sm"
                            />
                        </div>
                    </div>
                );
            case 'QUIZ':
                return (
                    <div className="space-y-4">
                        <QuizBuilder
                            initialConfig={lesson.quizConfig}
                            onChange={(json) => setLesson(prev => ({ ...prev, quizConfig: json }))}
                            courseTitle={courseData?.title}
                            courseDescription={courseData?.description}
                            lessonTitle={lesson.title}
                        />
                    </div>
                );
            case 'CODE':
            case 'CODING':
                return (
                    <div className="space-y-4">
                        <CodeBuilder
                            initialConfig={lesson.codeChallengeConfig}
                            onChange={(json) => setLesson(prev => ({ ...prev, codeChallengeConfig: json }))}
                            courseTitle={courseData?.title}
                            courseDescription={courseData?.description}
                            lessonTitle={lesson.title}
                        />
                    </div>
                );
            default:
                return <div>Select a lesson type</div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <h3 className="font-serif text-lg text-neutral-900 dark:text-white">
                        {lessonId ? 'Edit Lesson' : 'Create Lesson'}
                    </h3>
                    <button onClick={onCancel} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Lesson Title</label>
                                <input
                                    name="title"
                                    value={lesson.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Type</label>
                                <select
                                    name="type"
                                    value={lesson.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
                                >
                                    <option value="VIDEO">Video Lesson</option>
                                    <option value="QUIZ">Quiz</option>
                                    <option value="CODE">Coding Challenge</option>
                                    <option value="TEXT">Text / Article</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                            <h4 className="font-medium text-neutral-900 dark:text-white mb-4">Content Configuration</h4>
                            {renderContentEditor()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-950 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Lesson'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonEditor;
