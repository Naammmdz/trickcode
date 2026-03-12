import { useState } from 'react';
import { courseService } from '../../services/courseService';

const AiGenerateModal = ({ type, courseTitle, courseDescription, lessonTitle, onApply, onClose }) => {
    const [customPrompt, setCustomPrompt] = useState('');
    const [count, setCount] = useState(type === 'quiz' ? 5 : 3);
    const [language, setLanguage] = useState('vi');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    const isQuiz = type === 'quiz';

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setPreview(null);

        try {
            let result;
            if (isQuiz) {
                result = await courseService.generateQuiz({
                    courseTitle,
                    courseDescription,
                    lessonTitle,
                    customPrompt,
                    questionCount: count,
                    language,
                });
            } else {
                result = await courseService.generateCode({
                    courseTitle,
                    courseDescription,
                    lessonTitle,
                    customPrompt,
                    testCaseCount: count,
                    language,
                });
            }

            if (result.error) {
                setError(result.error);
            } else {
                setPreview(result);
            }
        } catch (err) {
            setError(err.message || 'Failed to generate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!preview) return;
        onApply(preview);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-900">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white">
                                    AI Generate {isQuiz ? 'Quiz' : 'Code Challenge'}
                                </h3>
                                <p className="text-xs text-neutral-500">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Context info */}
                    {(courseTitle || lessonTitle) && (
                        <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg p-4 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Context</p>
                            <div className="space-y-1 text-sm">
                                {courseTitle && (
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        <span className="text-neutral-400">Course:</span>{' '}
                                        <span className="text-neutral-900 dark:text-white font-medium">{courseTitle}</span>
                                    </p>
                                )}
                                {lessonTitle && (
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        <span className="text-neutral-400">Lesson:</span>{' '}
                                        <span className="text-neutral-900 dark:text-white font-medium">{lessonTitle}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Config row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
                                {isQuiz ? 'Number of Questions' : 'Number of Test Cases'}
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={count}
                                onChange={(e) => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                                className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 text-sm transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 text-sm transition-colors"
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>

                    {/* Custom prompt */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
                            Custom Instructions <span className="font-normal text-neutral-300 dark:text-neutral-600">(Optional)</span>
                        </label>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 text-sm font-mono transition-colors resize-none"
                            placeholder={isQuiz
                                ? 'E.g. Focus on time complexity, include tricky edge cases...'
                                : 'E.g. Easy difficulty, array-based problem, similar to Two Sum...'
                            }
                        />
                    </div>

                    {/* Generate button */}
                    {!preview && (
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                    Generate with AI
                                </>
                            )}
                        </button>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-lg mt-0.5">error</span>
                            <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">Generation Failed</p>
                                <p className="text-xs text-red-600 dark:text-red-500 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {preview && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Preview Generated</span>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? (
                                        <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">refresh</span>
                                    )}
                                    Regenerate
                                </button>
                            </div>

                            {/* Quiz preview */}
                            {isQuiz && preview.questions && (
                                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                                    <div className="bg-neutral-50 dark:bg-neutral-950 px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                            {preview.questions.length} Questions
                                        </span>
                                    </div>
                                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[300px] overflow-y-auto">
                                        {preview.questions.map((q, idx) => (
                                            <div key={q.id || idx} className="p-4">
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                                                    <span className="text-neutral-400 mr-1">{idx + 1}.</span>
                                                    {q.question}
                                                </p>
                                                <div className="grid grid-cols-2 gap-1.5 ml-4">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div
                                                            key={oIdx}
                                                            className={`px-2.5 py-1.5 rounded text-xs ${
                                                                oIdx === q.correctAnswer
                                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium'
                                                                    : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-800'
                                                            }`}
                                                        >
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                                {q.explanation && (
                                                    <p className="text-[11px] text-neutral-400 mt-2 ml-4 italic">
                                                        💡 {q.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Code preview */}
                            {!isQuiz && (
                                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                                    <div className="bg-neutral-50 dark:bg-neutral-950 px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                            Code Challenge Preview
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                                        {/* Problem description */}
                                        {preview.problemDescription && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Problem</p>
                                                <div className="bg-neutral-50 dark:bg-neutral-950 rounded p-3 text-sm text-neutral-700 dark:text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed">
                                                    {preview.problemDescription.substring(0, 500)}
                                                    {preview.problemDescription.length > 500 && '...'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Function name */}
                                        {preview.functionName && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Function</p>
                                                <code className="text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">
                                                    {preview.functionName}()
                                                </code>
                                            </div>
                                        )}

                                        {/* Test cases summary */}
                                        {preview.testCases && preview.testCases.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">
                                                    {preview.testCases.length} Test Cases
                                                </p>
                                                <div className="space-y-2">
                                                    {preview.testCases.map((tc, idx) => (
                                                        <div key={idx} className="bg-neutral-50 dark:bg-neutral-950 rounded p-2.5 text-xs font-mono border border-neutral-100 dark:border-neutral-800">
                                                            <span className="text-neutral-400">Input:</span>{' '}
                                                            <span className="text-neutral-700 dark:text-neutral-300">{tc.input}</span>
                                                            <br />
                                                            <span className="text-neutral-400">Expected:</span>{' '}
                                                            <span className="text-emerald-600 dark:text-emerald-400">{tc.expected}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Initial code languages */}
                                        {preview.initialCode && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Starter Code</p>
                                                <div className="flex gap-2">
                                                    {Object.keys(preview.initialCode).map(lang => (
                                                        <span key={lang} className="text-[10px] uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-1 rounded font-bold">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {preview && (
                    <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-950">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">check</span>
                            Apply to Builder
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiGenerateModal;
