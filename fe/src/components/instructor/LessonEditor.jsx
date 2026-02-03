import { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import QuizBuilder from './QuizBuilder';
import CodeBuilder from './CodeBuilder';

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

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic'); // basic, content

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
        } else {
            // Set default type if provided or defaults
        }
    }, [lessonId]);

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
            onSave();
        } catch (error) {
            alert('Failed to save lesson: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Content Editors
    const renderContentEditor = () => {
        switch (lesson.type) {
            case 'VIDEO':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Video URL</label>
                            <input
                                name="videoUrl"
                                value={lesson.videoUrl || ''}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400"
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
