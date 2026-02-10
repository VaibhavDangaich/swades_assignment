import { useState, useEffect } from 'react';

const statusWords = ['Analyzing', 'Routing', 'Searching', 'Processing', 'Thinking'];

export default function TypingIndicator({ agentType }) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % statusWords.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start mb-6">
      <div className="flex items-center gap-2 mb-1.5 ml-1">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[11px] font-medium text-white/50">Atlas</span>
      </div>
      <div className="bg-[#1e1e2e] border border-white/[0.04] rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-3">
        <span className="inline-flex gap-1">
          <span className="w-2 h-2 bg-violet-400/40 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
          <span className="w-2 h-2 bg-violet-400/40 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }} />
          <span className="w-2 h-2 bg-violet-400/40 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }} />
        </span>
        <span className="text-[13px] text-white/25">{statusWords[wordIndex]}...</span>
      </div>
    </div>
  );
}
