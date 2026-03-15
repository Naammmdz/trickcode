import { useState, useEffect, useRef } from 'react';
import { aiLearningService } from '../../services/proService';
import MarkdownRenderer from '../common/MarkdownRenderer';

/**
 * AI Assistant Panel — Chat-style UI for AI learning assistance.
 * Supports code (hint, explain, ask) and quiz (ask-quiz) modes.
 */
const AiAssistantPanel = ({ isOpen, onClose, isPro, mode = 'code', context = {} }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState(mode === 'quiz' ? 'ask-quiz' : 'ask');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevContextRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && isPro) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isPro]);

  // Auto-detect quiz context change (when user clicks "Ask AI" on a question)
  useEffect(() => {
    if (mode === 'quiz' && context.quizQuestion && isOpen) {
      const contextKey = `${context.quizQuestion}-${context.studentAnswer}-${context.correctAnswer}`;
      if (prevContextRef.current !== contextKey) {
        prevContextRef.current = contextKey;
        const newContext = {
          role: 'context',
          quizQuestion: context.quizQuestion,
          studentAnswer: context.studentAnswer,
          correctAnswer: context.correctAnswer,
        };
        setMessages(prev => {
          // If last message is a context card (no user message after it), replace it
          if (prev.length > 0 && prev[prev.length - 1].role === 'context') {
            return [...prev.slice(0, -1), newContext];
          }
          return [...prev, newContext];
        });
      }
    }
  }, [context.quizQuestion, context.studentAnswer, context.correctAnswer, isOpen]);

  // Auto-detect failed test context change
  useEffect(() => {
    if (mode === 'code' && context.failedTest && isOpen) {
      const contextKey = `${context.failedTest.input}-${context.failedTest.expected}-${context.failedTest.actual}`;
      if (prevContextRef.current !== contextKey) {
        prevContextRef.current = contextKey;
        const newContext = {
          role: 'context',
          failedTest: context.failedTest,
        };
        setMessages(prev => {
          if (prev.length > 0 && prev[prev.length - 1].role === 'context') {
            return [...prev.slice(0, -1), newContext];
          }
          return [...prev, newContext];
        });
      }
    }
  }, [context.failedTest, isOpen]);

  const handleSend = async (customMessage) => {
    if (!isPro) return;
    const userMessage = customMessage || input.trim();

    if (activeMode === 'ask' || activeMode === 'ask-quiz') {
      if (!userMessage) return;
    }

    setLoading(true);
    setInput('');

    // Add user message to chat
    let displayMessage = userMessage;
    if (activeMode === 'hint') displayMessage = '💡 Give me a hint for my code';
    if (activeMode === 'explain') displayMessage = '🐛 Explain why this test case failed';

    setMessages(prev => [...prev, { role: 'user', content: displayMessage }]);

    try {
      let result;
      let aiResponse = '';

      if (activeMode === 'hint') {
        result = await aiLearningService.getCodeHint(
          context.sourceCode, context.language, context.problemDescription || userMessage
        );
        aiResponse = result.hint;
      } else if (activeMode === 'explain') {
        if (!context.failedTest) {
          aiResponse = 'No failed test case selected. Click on a failed test in the results panel first.';
        } else {
          result = await aiLearningService.explainFailure(
            context.sourceCode, context.language,
            context.failedTest.input, context.failedTest.expected, context.failedTest.actual
          );
          aiResponse = result.explanation;
        }
      } else if (activeMode === 'ask') {
        result = await aiLearningService.askCodeQuestion(
          context.sourceCode, context.language, userMessage
        );
        aiResponse = result.answer;
      } else if (activeMode === 'ask-quiz') {
        // Find the most recent context card for quiz question
        const lastContext = [...messages].reverse().find(m => m.role === 'context' && m.quizQuestion);
        result = await aiLearningService.askQuizQuestion(
          lastContext?.quizQuestion || context.quizQuestion,
          lastContext?.studentAnswer || context.studentAnswer,
          lastContext?.correctAnswer || context.correctAnswer,
          userMessage || 'Explain this question in detail'
        );
        aiResponse = result.explanation;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: err.data?.error || err.message || 'AI request failed. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    prevContextRef.current = null;
  };

  const codeTabs = [
    { id: 'ask', label: 'Chat', icon: 'chat' },
    { id: 'hint', label: 'Hint', icon: 'lightbulb' },
    { id: 'explain', label: 'Debug', icon: 'bug_report' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] max-w-full z-50 flex flex-col bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl animate-slide-in-right">
      {/* Header */}
      <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 bg-neutral-50 dark:bg-neutral-900 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
          <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">AI Assistant</span>
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded">PRO</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleClearChat} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" title="Clear chat">
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
          </button>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>

      {/* Not Pro Banner */}
      {!isPro && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 shrink-0">
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

      {/* Mode Tabs (code mode only) */}
      {mode === 'code' && (
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          {codeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-sans uppercase tracking-widest transition-colors ${
                activeMode === tab.id
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              {mode === 'quiz' ? 'Quiz AI Assistant' : 'Code AI Assistant'}
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-[240px]">
              {mode === 'quiz'
                ? 'Click "Ask AI" on any quiz question, then ask me to explain in detail.'
                : activeMode === 'hint'
                  ? 'I\'ll analyze your code and give hints without revealing the answer.'
                  : activeMode === 'explain'
                    ? 'Click on a failed test case, then I\'ll explain why it failed.'
                    : 'Ask me anything about your code — I\'m here to help you learn!'
              }
            </p>
            {/* Quick actions */}
            {mode === 'code' && activeMode === 'ask' && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Why doesn\'t my code work?', 'Explain the approach', 'What\'s the time complexity?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="px-3 py-1.5 text-[10px] text-neutral-500 border border-neutral-200 dark:border-neutral-800 rounded-full hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {mode === 'quiz' && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Why is this correct?', 'Explain step by step', 'Give me a similar example'].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="px-3 py-1.5 text-[10px] text-neutral-500 border border-neutral-200 dark:border-neutral-800 rounded-full hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg, idx) => {
          // Context Card (quiz question or failed test)
          if (msg.role === 'context') {
            return (
              <div key={idx} className="mx-auto max-w-[95%]">
                {msg.quizQuestion && (
                  <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/40 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-orange-500 text-sm">quiz</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-orange-500">Quiz Question</span>
                    </div>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 mb-2 leading-relaxed">{msg.quizQuestion}</p>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-red-400 text-xs">close</span>
                        <span className="text-neutral-500">Your answer:</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">{msg.studentAnswer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-500 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        <span className="text-neutral-500">Correct:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{msg.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                )}
                {msg.failedTest && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-red-500 text-sm">bug_report</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-red-500">Failed Test Case</span>
                    </div>
                    <div className="text-xs font-mono space-y-1">
                      <div><span className="text-neutral-500">Input: </span><span className="text-neutral-800 dark:text-neutral-200">{msg.failedTest.input}</span></div>
                      <div><span className="text-neutral-500">Expected: </span><span className="text-emerald-600 dark:text-emerald-400">{msg.failedTest.expected}</span></div>
                      <div><span className="text-neutral-500">Got: </span><span className="text-red-600 dark:text-red-400">{msg.failedTest.actual}</span></div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // User Message
          if (msg.role === 'user') {
            return (
              <div key={idx} className="flex justify-end">
                <div className="max-w-[85%] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl rounded-br-sm px-4 py-2.5">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          // AI Response
          if (msg.role === 'assistant') {
            return (
              <div key={idx} className="flex justify-start">
                <div className="max-w-[95%] flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-primary text-xs">smart_toy</span>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 min-w-0">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                </div>
              </div>
            );
          }

          // Error Message
          if (msg.role === 'error') {
            return (
              <div key={idx} className="mx-auto max-w-[95%]">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm shrink-0">error</span>
                  {msg.content}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-xs animate-spin">sync</span>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-neutral-400">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-900 shrink-0">
        {/* Quick action buttons for code mode */}
        {mode === 'code' && (activeMode === 'hint' || activeMode === 'explain') && (
          <button
            onClick={() => handleSend(activeMode === 'hint' ? 'Give me a hint' : 'Explain this failure')}
            disabled={loading || !isPro}
            className="w-full mb-2 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{activeMode === 'hint' ? 'lightbulb' : 'bug_report'}</span>
            {activeMode === 'hint' ? 'Get Hint' : 'Explain Failure'}
          </button>
        )}

        {/* Chat input */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === 'quiz'
                  ? 'Ask about this question...'
                  : activeMode === 'hint'
                    ? 'Or ask a specific question...'
                    : 'Type your question...'
              }
              rows={1}
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-neutral-900 dark:text-white placeholder:text-neutral-400 max-h-24 overflow-y-auto"
              disabled={!isPro || loading}
              style={{ minHeight: '40px' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={loading || !isPro || (!input.trim() && (activeMode === 'ask' || activeMode === 'ask-quiz'))}
            className="w-10 h-10 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
        <p className="text-[9px] text-neutral-400 mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AiAssistantPanel;
