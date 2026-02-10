import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatContainer from './components/ChatContainer.jsx';

export default function App() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleNewChat() {
    setActiveConversation(null);
  }

  function handleSelectConversation(id) {
    setActiveConversation(id);
  }

  function handleConversationCreated(id) {
    setActiveConversation(id);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        activeId={activeConversation}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        refreshKey={refreshKey}
      />
      <ChatContainer
        conversationId={activeConversation}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
