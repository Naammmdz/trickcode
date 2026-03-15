import { useState, useEffect } from 'react';
import AiGenerateModal from './AiGenerateModal';

const CodeBuilder = ({ initialConfig, onChange, courseTitle, courseDescription, lessonTitle }) => {
    const [config, setConfig] = useState({
        problemDescription: '',
        functionName: '',
        initialCode: {
            python: '',
            javascript: '',
            java: ''
        },
        testCases: []
    });

    const [activeTab, setActiveTab] = useState('description'); // description, code, tests
    const [showAiModal, setShowAiModal] = useState(false);

    useEffect(() => {
        if (initialConfig) {
            try {
                const parsed = JSON.parse(initialConfig);
                setConfig(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Invalid code config JSON', e);
            }
        }
    }, []);

    // Sync to parent
    useEffect(() => {
        onChange(JSON.stringify(config, null, 2));
    }, [config, onChange]);

    const updateInitialCode = (lang, code) => {
        setConfig(prev => ({
            ...prev,
            initialCode: { ...prev.initialCode, [lang]: code }
        }));
    };

    const addTestCase = () => {
        setConfig(prev => ({
            ...prev,
            testCases: [...(prev.testCases || []), { input: '', expected: '' }]
        }));
    };

    const updateTestCase = (index, field, value) => {
        const newCases = [...(config.testCases || [])];
        newCases[index] = { ...newCases[index], [field]: value };
        setConfig(prev => ({ ...prev, testCases: newCases }));
    };

    const removeTestCase = (index) => {
        const newCases = [...(config.testCases || [])];
        newCases.splice(index, 1);
        setConfig(prev => ({ ...prev, testCases: newCases }));
    };

    const handleAiApply = (result) => {
        if (!result) return;
        setConfig(prev => ({
            ...prev,
            problemDescription: result.problemDescription || prev.problemDescription,
            functionName: result.functionName || prev.functionName,
            initialCode: result.initialCode ? { ...prev.initialCode, ...result.initialCode } : prev.initialCode,
            testCases: result.testCases || prev.testCases,
        }));
    };

    return (
        <div className="space-y-4 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            {/* Tabs + AI Button */}
            <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'description' ? 'bg-white dark:bg-neutral-800 border-b-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'code' ? 'bg-white dark:bg-neutral-800 border-b-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                        Initial Code
                    </button>
                    <button
                        onClick={() => setActiveTab('tests')}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'tests' ? 'bg-white dark:bg-neutral-800 border-b-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                        Test Cases
                    </button>
                </div>
                <button
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-md hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm mr-3"
                >
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI Generate
                </button>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900">
                {activeTab === 'description' && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-neutral-500 mb-2">Describe the problem using Markdown.</p>
                            <textarea
                                value={config.problemDescription || ''}
                                onChange={(e) => setConfig({ ...config, problemDescription: e.target.value })}
                                rows={10}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400 font-mono text-sm"
                                placeholder="# Problem Title&#10;&#10;Description..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Function Name</label>
                            <input
                                value={config.functionName || ''}
                                onChange={(e) => setConfig({ ...config, functionName: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400 text-sm font-mono"
                                placeholder="e.g. twoSum"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {['python', 'javascript', 'java'].map(lang => (
                                <div key={lang}>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">{lang}</label>
                                    <textarea
                                        value={config.initialCode?.[lang] || ''}
                                        onChange={(e) => updateInitialCode(lang, e.target.value)}
                                        rows={5}
                                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:border-neutral-400 font-mono text-xs"
                                        placeholder={`// Initial ${lang} code...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-neutral-500">Define inputs and expected outputs.</p>
                            <button
                                onClick={addTestCase}
                                className="text-xs font-bold uppercase text-primary hover:text-primary/80"
                            >
                                + Add Test Case
                            </button>
                        </div>

                        {(!config.testCases || config.testCases.length === 0) && (
                            <div className="text-center py-6 text-neutral-400 bg-neutral-50 dark:bg-neutral-950 rounded border border-dashed border-neutral-200 dark:border-neutral-800">
                                No test cases defined.
                            </div>
                        )}

                        {(config.testCases || []).map((tc, idx) => (
                            <div key={idx} className="flex gap-3 items-start bg-neutral-50 dark:bg-neutral-950 p-3 rounded group relative">
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-neutral-400">Input</span>
                                        <input
                                            value={tc.input}
                                            onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                            className="w-full px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-neutral-400">Expected Output</span>
                                        <input
                                            value={tc.expected}
                                            onChange={(e) => updateTestCase(idx, 'expected', e.target.value)}
                                            className="w-full px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-mono"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeTestCase(idx)}
                                    className="text-neutral-400 hover:text-red-500 mt-1"
                                >
                                    <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Generate Modal */}
            {showAiModal && (
                <AiGenerateModal
                    type="code"
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

export default CodeBuilder;
