import { useState, useEffect, useRef } from 'react';
import { fetchConversation, sendMessage } from '../lib/api.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function ChatContainer({ conversationId, onConversationCreated }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentType, setAgentType] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function loadConversation(id) {
    try {
      const data = await fetchConversation(id);
      setMessages(data?.messages || []);
    } catch {
      setMessages([]);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: userMessage }]);
    setIsLoading(true);
    setAgentType(null);

    try {
      const res = await sendMessage(userMessage, conversationId);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let currentAgentType = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'start') {
              currentAgentType = data.agentType;
              setAgentType(data.agentType);
              if (!conversationId && data.conversationId) {
                onConversationCreated(data.conversationId);
              }
            }

            if (data.type === 'text') {
              assistantContent += data.content;
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg?.role === 'assistant') {
                  lastMsg.content = assistantContent;
                } else {
                  updated.push({
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: assistantContent,
                    agentType: currentAgentType,
                  });
                }
                return updated;
              });
            }

            if (data.type === 'done') setIsLoading(false);
            if (data.type === 'error') {
              setMessages((prev) => [
                ...prev,
                { id: Date.now() + 2, role: 'assistant', content: `Error: ${data.message}` },
              ]);
              setIsLoading(false);
            }
          } catch { /* skip */ }
        }
      }
      setIsLoading(false);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, role: 'assistant', content: 'Connection failed. Is the server running?' },
      ]);
      setIsLoading(false);
    }
  }

  const suggestions = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
        </svg>
      ),
      label: 'Order Tracking',
      desc: 'Check order status and delivery updates',
      query: 'Where is my order ORD-001?',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      label: 'Billing & Refunds',
      desc: 'Check invoices, payments, and refund status',
      query: 'Check refund status for INV-002',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: 'General Support',
      desc: 'Get help with account settings and more',
      query: 'How do I reset my password?',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#18181f] min-w-0">
      {/* Header */}
      <div className="px-8 py-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-white/90">Atlas Support</h2>
            <p className="text-[11px] text-white/30">Typically replies in seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages or Empty State */}
      {messages.length === 0 && !isLoading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center w-full max-w-2xl">
            {/* Decorative Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/15 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8b5cf6' }} />
                    <stop offset="100%" style={{ stopColor: '#6366f1' }} />
                  </linearGradient>
                </defs>
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-white/90 mb-2">How can I help you today?</h2>
            <p className="text-[15px] text-white/35 mb-10 leading-relaxed max-w-md mx-auto">
              I can help you troubleshoot issues, explain features, or process requests instantly.
            </p>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {suggestions.map((s) => (
                <button
                  key={s.query}
                  onClick={() => setInput(s.query)}
                  className="group text-left bg-[#1e1e2e] hover:bg-[#252535] border border-white/[0.06] hover:border-violet-500/20 rounded-xl p-5 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-400/70 mb-4">
                    {s.icon}
                  </div>
                  <h3 className="text-[14px] font-medium text-white/80 group-hover:text-white/95 mb-1.5 transition-colors">{s.label}</h3>
                  <p className="text-[12px] text-white/30 leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center text-violet-400/50 group-hover:text-violet-400/80 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Date Divider */}
          <div className="flex items-center justify-center py-5">
            <span className="text-[11px] font-medium text-white/20 uppercase tracking-wider">Today</span>
          </div>
          <div className="max-w-4xl mx-auto px-10 pb-8">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && !messages.some((m) => m.role === 'assistant' && m.content) && (
              <TypingIndicator agentType={agentType} />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-8 pb-4 pt-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          <div className="flex items-center bg-[#1e1e2e] border border-white/[0.06] rounded-2xl px-4 py-2 focus-within:border-violet-500/30 transition-all duration-200">
            <button type="button" className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/50 transition-colors cursor-pointer shrink-0 mr-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 py-2.5 bg-transparent text-[14px] text-white/90 placeholder-white/25 focus:outline-none disabled:opacity-40"
            />
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button type="button" className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/50 transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 flex items-center justify-center text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-violet-600/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </form>
        <p className="text-center text-[10px] text-white/15 mt-2">AI can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  );
}
