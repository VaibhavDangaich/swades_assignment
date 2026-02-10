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
      let newConversationId = conversationId;

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
                newConversationId = data.conversationId;
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

            if (data.type === 'done') {
              setIsLoading(false);
            }

            if (data.type === 'error') {
              setMessages((prev) => [
                ...prev,
                { id: Date.now() + 2, role: 'assistant', content: `Error: ${data.message}` },
              ]);
              setIsLoading(false);
            }
          } catch {
            // skip malformed JSON
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, role: 'assistant', content: 'Failed to connect to server.' },
      ]);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      {messages.length === 0 && !isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-2xl">
              🤖
            </div>
            <h2 className="text-xl font-semibold text-slate-200">How can I help you?</h2>
            <p className="text-slate-500 text-sm max-w-sm">
              Ask about orders, billing, or general support. I'll route you to the right agent.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['Where is my order ORD-001?', 'I need a refund for INV-002', 'How do I reset my password?'].map(
                (q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && !messages.some((m) => m.role === 'assistant' && m.content) && (
            <TypingIndicator agentType={agentType} />
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
