import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const agentConfig = {
    order: {
      label: 'Order Agent',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      icon: '📦',
    },
    billing: {
      label: 'Billing Agent',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      icon: '💳',
    },
    support: {
      label: 'Support Agent',
      color: 'from-violet-500 to-indigo-600',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      icon: '💬',
    },
  };

  const agent = agentConfig[message.agentType] || agentConfig.support;

  function formatTime() {
    const d = message.createdAt ? new Date(message.createdAt) : new Date();
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  if (isUser) {
    return (
      <div className="flex flex-col items-end mb-8">
        <div className="flex items-center gap-2.5 mb-2 mr-1">
          <span className="text-[11px] text-white/35">{formatTime()}</span>
          <span className="text-[12px] font-medium text-white/55">You</span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">U</span>
          </div>
        </div>
        <div className="max-w-[70%] bg-gradient-to-br from-[#2a2a3a] to-[#252535] rounded-2xl rounded-br-md px-6 py-4 shadow-lg shadow-black/10">
          <p className="text-[15px] leading-relaxed text-white/95 break-words whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start mb-8">
      <div className="flex items-center gap-2.5 mb-2 ml-1">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-md`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
          </svg>
        </div>
        
        {message.agentType && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${agent.bgColor} ${agent.textColor} border ${agent.borderColor}`}>
            <span>{agent.icon}</span>
            {agent.label}
          </span>
        )}
        
        <span className="text-[11px] text-white/30">{formatTime()}</span>
      </div>
      
      <div className={`max-w-[75%] bg-[#1e1e2e] border ${message.agentType ? agent.borderColor : 'border-white/[0.06]'} rounded-2xl rounded-bl-md px-6 py-4 shadow-lg shadow-black/10`}>
        <div className="markdown-body text-[15px] leading-relaxed text-white/80 break-words overflow-hidden">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
      
      {message.agentType && (
        <div className="mt-2 ml-1 flex items-center gap-2">
          <span className="text-[10px] text-white/20">Routed to</span>
          <span className={`text-[10px] font-medium ${agent.textColor}`}>{message.agentType.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}
