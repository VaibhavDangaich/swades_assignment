import { useState, useEffect } from 'react';

const statusWords = ['Analyzing', 'Routing', 'Searching', 'Processing', 'Thinking'];

const agentConfig = {
  order: {
    label: 'Order Agent',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    dotColor: 'bg-blue-400/40',
    icon: '📦',
  },
  billing: {
    label: 'Billing Agent',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400/40',
    icon: '💳',
  },
  support: {
    label: 'Support Agent',
    color: 'from-violet-500 to-indigo-600',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    dotColor: 'bg-violet-400/40',
    icon: '💬',
  },
};

export default function TypingIndicator({ agentType }) {
  const [wordIndex, setWordIndex] = useState(0);
  const agent = agentConfig[agentType] || agentConfig.support;

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % statusWords.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start mb-6">
      <div className="flex items-center gap-2.5 mb-2 ml-1">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-md`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
          </svg>
        </div>
        
        {agentType && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${agent.bgColor} ${agent.textColor} border ${agent.borderColor} animate-pulse`}>
            <span>{agent.icon}</span>
            {agent.label}
          </span>
        )}
        
        {!agentType && (
          <span className="text-[11px] font-medium text-white/50">Routing...</span>
        )}
      </div>
      
      <div className={`bg-[#1e1e2e] border ${agentType ? agent.borderColor : 'border-white/[0.04]'} rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-3`}>
        <span className="inline-flex gap-1">
          <span className={`w-2 h-2 ${agent.dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
          <span className={`w-2 h-2 ${agent.dotColor} rounded-full animate-bounce`} style={{ animationDelay: '150ms', animationDuration: '0.8s' }} />
          <span className={`w-2 h-2 ${agent.dotColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms', animationDuration: '0.8s' }} />
        </span>
        <span className={`text-[13px] ${agentType ? agent.textColor + '/60' : 'text-white/25'}`}>
          {agentType ? `${agent.label} is responding...` : `${statusWords[wordIndex]}...`}
        </span>
      </div>
    </div>
  );
}
