import { useState, useEffect } from 'react';

const thinkingWords = [
  'Analyzing query...', 'Searching database...', 'Classifying intent...',
  'Routing to agent...', 'Checking records...', 'Processing request...',
  'Looking up details...', 'Fetching information...',
];

export default function TypingIndicator({ agentType }) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % thinkingWords.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const agentLabels = {
    order: 'Order Agent',
    billing: 'Billing Agent',
    support: 'Support Agent',
  };

  const label = agentLabels[agentType] || 'AI Agent';

  return (
    <div className="flex items-start gap-3 px-6 py-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
        AI
      </div>
      <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
        <p className="text-xs text-violet-400 font-medium mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-sm text-slate-400 italic">{thinkingWords[wordIndex]}</span>
        </div>
      </div>
    </div>
  );
}
