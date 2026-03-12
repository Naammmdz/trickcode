import { useState } from 'react';
import { aiLearningService } from '../../services/proService';

/**
 * AI Assistant Panel — floating panel with code hint, explain fail, and ask features.
 * Used in CodeWorkspace and QuizResult pages.
 */
const AiAssistantPanel = ({ isOpen, onClose, isPro, mode = 'code', context = {} }) => {
  const [activeTab, setActiveTab] = useState(mode === 'quiz' ? 'ask-quiz' : 'hint');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs = mode === 'code'
    ? [
        { id: 'hint', label: 'Hint', icon: 'lightbulb' },
        { id: 'explain', label: 'Explain Fail', icon: 'bug_report' },
        { id: 'ask', label: 'Ask AI', icon: 'chat' },
      ]
    : [
        { id: 'ask-quiz', label: 'Ask AI', icon: 'chat' },
      ];

  const handleSubmit = async () => {
    if (!isPro) return;
    setLoading(true);
    setError('');
    setResponse('');

    try {
      let result;
      if (activeTab === 'hint') {
        result = await aiLearningService.getCodeHint(
          context.sourceCode, context.language, context.problemDescription || question
        );
        setResponse(result.hint);
      } else if (activeTab === 'explain') {
        if (!context.failedTest) {
          setError('No failed test case selected. Click on a failed test first.');
          setLoading(false);
          return;
        }
        result = await aiLearningService.explainFailure(
          context.sourceCode, context.language,
          context.failedTest.input, context.failedTest.expected, context.failedTest.actual
        );
        setResponse(result.explanation);
      } else if (activeTab === 'ask') {
        if (!question.trim()) {
          setError('Please enter your question.');
          setLoading(false);
          return;
        }
        result = await aiLearningService.askCodeQuestion(
          context.sourceCode, context.language, question
        );
        setResponse(result.answer);
      } else if (activeTab === 'ask-quiz') {
        result = await aiLearningService.askQuizQuestion(
          context.quizQuestion, context.studentAnswer,
          context.correctAnswer, question || 'Explain this question in detail'
        );
        setResponse(result.explanation);
      }
    } catch (err) {
      setError(err.data?.error || err.message || 'AI request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-full z-50 flex flex-col bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl animate-slide-in-right">
      {/* Header */}
      <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 bg-neutral-50 dark:bg-neutral-900 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
          <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">AI Assistant</span>
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded">PRO</span>
        </div>
        <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Not Pro Banner */}
      {!isPro && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500 text-lg shrink-0">lock</span>
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">Pro Feature</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">Upgrade to Student Pro to unlock AI learning assistance.</p>
              <a href="/checkout/pro?plan=STUDENT_PRO" className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors">
                <span className="material-symbols-outlined text-sm">stars</span>
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResponse(''); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-sans uppercase tracking-widest transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Context Info */}
        {activeTab === 'hint' && (
          <div className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-800">
            <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
            AI will analyze your code and give hints without revealing the answer.
          </div>
        )}
        {activeTab === 'explain' && (
          <div className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-800">
            <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
            {context.failedTest
              ? `Analyzing failed test: Input "${context.failedTest.input}" — Expected "${context.failedTest.expected}", Got "${context.failedTest.actual}"`
              : 'Click on a failed test case in the results panel first.'}
          </div>
        )}

        {/* Question Input (for ask and ask-quiz) */}
        {(activeTab === 'ask' || activeTab === 'ask-quiz') && (
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-neutral-400 mb-2">Your question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={activeTab === 'ask-quiz' ? 'Why is this the correct answer?' : 'Why does my loop not stop?'}
              className="w-full h-24 p-3 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-neutral-900 dark:text-white placeholder:text-neutral-400"
              disabled={!isPro}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isPro}
          className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              Thinking...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              {activeTab === 'hint' ? 'Get Hint' : activeTab === 'explain' ? 'Explain Failure' : 'Ask AI'}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              <span className="text-xs font-sans uppercase tracking-widest text-neutral-400">AI Response</span>
            </div>
            <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistantPanel;
