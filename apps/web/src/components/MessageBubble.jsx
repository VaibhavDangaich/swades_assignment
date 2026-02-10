export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const agentLabels = {
    order: 'Order Agent',
    billing: 'Billing Agent',
    support: 'Support Agent',
  };

  return (
    <div className={`flex items-start gap-3 px-6 py-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
            : 'bg-gradient-to-br from-violet-500 to-blue-500 text-white'
        }`}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-tr-sm'
            : 'bg-slate-800 text-slate-200 rounded-tl-sm'
        }`}
      >
        {!isUser && message.agentType && (
          <p className="text-xs text-violet-400 font-medium mb-1">
            {agentLabels[message.agentType] || 'AI Agent'}
          </p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
