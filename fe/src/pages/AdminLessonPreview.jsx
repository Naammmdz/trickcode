import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';

const AdminLessonPreview = ({ lessonId, onClose }) => {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lessonId) {
            const loadLesson = async () => {
                try {
                    setLoading(true);
                    const data = await courseService.getLesson(lessonId);
                    setLesson(data);
                } catch (error) {
                    console.error('Failed to load lesson', error);
                } finally {
                    setLoading(false);
                }
            };
            loadLesson();
        }
    }, [lessonId]);

    const renderQuizPreview = () => {
        if (!lesson.quizConfig) return <div className="text-sm text-neutral-500 italic">No quiz configuration found.</div>;
        let questions = [];
        try {
            const parsed = JSON.parse(lesson.quizConfig);
            if (parsed && Array.isArray(parsed.questions)) {
                questions = parsed.questions;
            }
        } catch (e) {
            return <div className="text-sm text-red-500">Invalid Quiz JSON</div>;
        }

        if (questions.length === 0) return <div className="text-sm text-neutral-500 italic">No questions in this quiz.</div>;

        return (
            <div className="space-y-4">
                {questions.map((q, qIndex) => (
                    <div key={q.id || qIndex} className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div className="text-xs font-bold uppercase text-neutral-400 mb-2">Question {qIndex + 1}</div>
                        <div className="text-sm text-neutral-900 dark:text-neutral-100 mb-4">{q.question}</div>

                        <div className="space-y-2">
                            {q.options && q.options.map((opt, oIndex) => {
                                const isCorrect = q.correctAnswer === oIndex;
                                return (
                                    <div key={oIndex} className={`flex items-center gap-3 p-2 rounded text-sm ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50' : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'}`}>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isCorrect ? 'border-green-500 bg-green-500' : 'border-neutral-300 dark:border-neutral-600'}`}>
                                            {isCorrect && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                                        </div>
                                        <span>{opt}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {q.explanation && (
                            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                <span className="text-xs font-bold uppercase text-neutral-400 mr-2">Explanation:</span>
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">{q.explanation}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderCodePreview = () => {
        if (!lesson.codeChallengeConfig) return <div className="text-sm text-neutral-500 italic">No code challenge configuration found.</div>;
        let config = {};
        try {
            config = JSON.parse(lesson.codeChallengeConfig);
        } catch (e) {
            return <div className="text-sm text-red-500">Invalid Code JSON</div>;
        }

        return (
            <div className="space-y-6">
                <div>
                    <h5 className="text-xs font-bold uppercase text-neutral-500 mb-2">Problem Description</h5>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-mono whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                        {config.problemDescription || "No description provided."}
                    </div>
                </div>

                <div>
                    <h5 className="text-xs font-bold uppercase text-neutral-500 mb-2">Initial Code</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['python', 'javascript', 'java'].map(lang => (
                            <div key={lang} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-bold uppercase text-neutral-500 border-b border-neutral-200 dark:border-neutral-700">
                                    {lang}
                                </div>
                                <div className="p-3 text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap min-h-[100px]">
                                    {config.initialCode?.[lang] || <span className="text-neutral-400 italic">No code</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h5 className="text-xs font-bold uppercase text-neutral-500 mb-2">Test Cases</h5>
                    {(!config.testCases || config.testCases.length === 0) ? (
                        <div className="text-sm text-neutral-500 italic p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">No test cases defined.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {config.testCases.map((tc, idx) => (
                                <div key={idx} className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Input</span>
                                        <code className="text-xs bg-white dark:bg-neutral-900 px-2 py-1 rounded block border border-neutral-200 dark:border-neutral-700">{tc.input}</code>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Expected Output</span>
                                        <code className="text-xs bg-white dark:bg-neutral-900 px-2 py-1 rounded block border border-neutral-200 dark:border-neutral-700">{tc.expected}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderContentPreview = () => {
        if (!lesson) return null;

        switch (lesson.type) {
            case 'VIDEO':
                const youtubeEmbedUrl = lesson.videoUrl?.includes('youtube.com') || lesson.videoUrl?.includes('youtu.be')
                    ? lesson.videoUrl.replace('watch?v=', 'embed/')
                    : lesson.videoUrl;

                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Video</label>
                            {lesson.videoUrl ? (
                                <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={youtubeEmbedUrl}
                                        title={lesson.title || 'Video Player'}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-neutral-900 dark:text-white p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center italic text-neutral-400">
                                    No URL provided
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Video Duration (Seconds)</label>
                            <div className="text-sm text-neutral-900 dark:text-white p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-neutral-200 dark:border-neutral-700">
                                {lesson.durationSeconds || 0}s
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-1.5">Transcript / Notes</label>
                            <div className="text-sm text-neutral-800 dark:text-neutral-200 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-neutral-200 dark:border-neutral-700 whitespace-pre-wrap font-mono min-h-[150px]">
                                {lesson.markdownContent || <span className="text-neutral-400 italic font-sans">No transcript provided</span>}
                            </div>
                        </div>
                    </div>
                );
            case 'QUIZ':
                return renderQuizPreview();
            case 'CODE':
            case 'CODING':
                return renderCodePreview();
            default:
                return (
                    <div className="text-sm text-neutral-500 italic p-6 text-center border border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                        Preview not formatting for lesson type: {lesson.type}
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/10">
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">
                                {lesson?.type === 'VIDEO' ? 'play_circle' :
                                    lesson?.type === 'QUIZ' ? 'quiz' :
                                        lesson?.type === 'CODE' ? 'code' : 'article'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-serif text-lg text-neutral-900 dark:text-white leading-tight">
                                {lesson?.title || 'Lesson Preview'}
                            </h3>
                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mt-0.5">
                                {loading ? 'Loading...' : `${lesson?.type} LESSON`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-neutral-900 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-neutral-900/50 z-10">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                            <span className="text-sm text-neutral-500">Loading lesson configuration...</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">Configuration Overview</h4>
                            {renderContentPreview()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLessonPreview;
