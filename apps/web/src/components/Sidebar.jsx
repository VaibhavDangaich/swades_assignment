import { useState, useEffect } from 'react';
import { fetchConversations, deleteConversation } from '../lib/api.js';
import { UserProfile } from './AuthWrapper.jsx';

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

  function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return 'Last week';
  }

  return (
    <aside className="w-[300px] min-w-[300px] bg-[#151520] flex flex-col h-full border-r border-white/[0.06]">
      <div className="px-6 pt-8 pb-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white">Atlas AI</span>
        </div>

        <button
          onClick={onNewChat}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          New conversation
        </button>
      </div>

      <div className="px-6 pt-3 pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/30">Recent</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group flex items-start justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 ${
              activeId === conv.id
                ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border border-violet-500/20 text-white'
                : 'text-white/50 hover:text-white/70 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate">{conv.title || 'New conversation'}</p>
              <p className={`text-[11px] mt-0.5 ${activeId === conv.id ? 'text-violet-300/60' : 'text-white/25'}`}>
                {formatTime(conv.createdAt)}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(e, conv.id)}
              className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400/80 ml-2 mt-0.5 transition-opacity cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center pt-12 px-4">
            <p className="text-white/15 text-xs">No conversations yet</p>
          </div>
        )}
      </div>

      <div className="px-6 py-5 border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserProfile />
            <div>
              <p className="text-[13px] font-semibold text-white/90">Account</p>
              <p className="text-[11px] text-white/35">Pro Plan</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/15">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
          <span className="text-[12px] text-emerald-400/80 font-medium">3 agents online</span>
        </div>
      </div>
    </aside>
  );
}
