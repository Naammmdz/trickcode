import { useState, useEffect } from 'react';
import AiGenerateModal from './AiGenerateModal';

const QuizBuilder = ({ initialConfig, onChange, courseTitle, courseDescription, lessonTitle }) => {
    const [questions, setQuestions] = useState([]);
    const [showAiModal, setShowAiModal] = useState(false);

    useEffect(() => {
        if (initialConfig) {
            try {
                const parsed = JSON.parse(initialConfig);
                if (parsed && Array.isArray(parsed.questions)) {
                    setQuestions(parsed.questions);
                }
            } catch (e) {
                console.error('Invalid quiz config JSON', e);
            }
        }
    }, []);

    // Sync changes to parent
    useEffect(() => {
        const config = { questions };
        onChange(JSON.stringify(config, null, 2));
    }, [questions]); // eslint-disable-line react-hooks/exhaustive-deps

    const addQuestion = () => {
        const newId = `q${Date.now()}`;
        setQuestions([
            ...questions,
            {
                id: newId,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                explanation: ''
            }
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleAiApply = (result) => {
        if (result && Array.isArray(result.questions)) {
            setQuestions(prev => [...prev, ...result.questions]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold uppercase text-neutral-500">Quiz Questions</h4>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAiModal(true)}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-md hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        AI Generate
                    </button>
                    <button
                        onClick={addQuestion}
                        className="text-xs font-bold uppercase text-primary hover:text-primary/80"
                    >
                        + Add Question
                    </button>
                </div>
            </div>

            {questions.length === 0 && (
                <div className="text-center py-8 text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                    <span className="material-symbols-outlined text-3xl mb-2 block text-neutral-300">quiz</span>
                    No questions added. Click <strong>AI Generate</strong> or <strong>+ Add Question</strong>.
                </div>
            )}

            {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded p-4 relative group">
                    <button
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>

                    <div className="space-y-4 pr-8">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Question {qIndex + 1}</label>
                            <input
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm focus:outline-none focus:border-neutral-400"
                                placeholder="Enter question text..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Options</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`correct-${q.id}`}
                                            checked={q.correctAnswer === oIndex}
                                            onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                            className="accent-primary cursor-pointer"
                                            title="Mark as correct answer"
                                        />
                                        <input
                                            value={opt}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            className={`flex-1 px-3 py-1.5 bg-white dark:bg-neutral-900 border ${q.correctAnswer === oIndex ? 'border-primary' : 'border-neutral-200 dark:border-neutral-800'} rounded text-sm focus:outline-none focus:border-neutral-400`}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Explanation (Optional)</label>
                            <textarea
                                value={q.explanation || ''}
                                onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm focus:outline-none focus:border-neutral-400"
                                placeholder="Explain why the answer is correct..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* AI Generate Modal */}
            {showAiModal && (
                <AiGenerateModal
                    type="quiz"
                    courseTitle={courseTitle}
                    courseDescription={courseDescription}
                    lessonTitle={lessonTitle}
                    onApply={handleAiApply}
                    onClose={() => setShowAiModal(false)}
                />
            )}
        </div>
    );
};

export default QuizBuilder;

