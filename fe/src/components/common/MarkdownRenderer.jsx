import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          code({ node, inline, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <div className="relative group my-3">
                  <div className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 z-10">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                      {match[1]}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(codeString)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white transition-all"
                      title="Copy code"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      padding: '1.25rem 1rem',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Inline code
            return (
              <code
                className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-orange-600 dark:text-orange-400 rounded text-[0.85em] font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Headings
          h1: ({ children }) => (
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-4 mb-2">{children}</h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-3 mb-2">{children}</h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-sm font-bold text-neutral-900 dark:text-white mt-3 mb-1.5">{children}</h5>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300 mb-2 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300 mb-2 pl-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          // Strong & Em
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-900 dark:text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-orange-400 pl-3 my-2 text-sm text-neutral-600 dark:text-neutral-400 italic">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="border-neutral-200 dark:border-neutral-800 my-3" />
          ),
          // Links
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
