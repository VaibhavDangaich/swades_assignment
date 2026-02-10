import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const agentLabels = {
    order: 'Atlas',
    billing: 'Atlas',
    support: 'Atlas',
  };

  function formatTime() {
    const d = message.createdAt ? new Date(message.createdAt) : new Date();
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  if (isUser) {
    return (
      <div className="flex flex-col items-end mb-6">
        <div className="flex items-center gap-2 mb-1.5 mr-1">
          <span className="text-[11px] text-white/30">{formatTime()}</span>
          <span className="text-[11px] font-medium text-white/50">You</span>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">U</span>
          </div>
        </div>
        <div className="max-w-[70%] bg-[#2a2a3a] rounded-2xl rounded-br-sm px-5 py-3.5">
          <p className="text-[14px] leading-relaxed text-white/90 break-words whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start mb-6">
      <div className="flex items-center gap-2 mb-1.5 ml-1">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[11px] font-medium text-white/50">{agentLabels[message.agentType] || 'Atlas'}</span>
        <span className="text-[11px] text-white/25">{formatTime()}</span>
      </div>
      <div className="max-w-[75%] bg-[#1e1e2e] border border-white/[0.04] rounded-2xl rounded-bl-sm px-5 py-3.5">
        <div className="markdown-body text-[14px] leading-relaxed text-white/75 break-words overflow-hidden">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
      {message.agentType && message.agentType !== 'support' && (
        <button className="mt-2 ml-1 flex items-center gap-1.5 text-[12px] text-violet-400/70 hover:text-violet-400 transition-colors cursor-pointer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          View Details
        </button>
      )}
    </div>
  );
}
