import { useState, useEffect } from 'react';
import { fetchConversations, deleteConversation } from '../lib/api.js';

export default function Sidebar({ activeId, onSelect, onNewChat, refreshKey }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    loadConversations();
  }, [refreshKey]);

  async function loadConversations() {
    try {
      const data = await fetchConversations();
      setConversations(data || []);
    } catch {
      setConversations([]);
    }
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    await deleteConversation(id);
    loadConversations();
    if (activeId === id) onNewChat();
  }

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-700/50 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          AI Support
        </h1>
      </div>

      <button
        onClick={onNewChat}
        className="mx-4 mt-4 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm transition-all duration-200 cursor-pointer"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto mt-4 px-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 ${
              activeId === conv.id
                ? 'bg-slate-700/60 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-sm truncate flex-1">{conv.title || 'New Conversation'}</span>
            <button
              onClick={(e) => handleDelete(e, conv.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 ml-2 transition-opacity text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}

        {conversations.length === 0 && (
          <p className="text-slate-500 text-sm text-center mt-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500">
        Multi-Agent System
      </div>
    </aside>
  );
}
