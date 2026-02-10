const BASE_URL = '/api';

export async function fetchConversations() {
    const res = await fetch(`${BASE_URL}/chat/conversations`);
    const data = await res.json();
    return data.data;
}

export async function fetchConversation(id) {
    const res = await fetch(`${BASE_URL}/chat/conversations/${id}`);
    const data = await res.json();
    return data.data;
}

export async function deleteConversation(id) {
    await fetch(`${BASE_URL}/chat/conversations/${id}`, { method: 'DELETE' });
}

export async function sendMessage(content, conversationId) {
    const res = await fetch(`${BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, conversationId }),
    });
    return res;
}

export async function fetchAgents() {
    const res = await fetch(`${BASE_URL}/agents`);
    const data = await res.json();
    return data.data;
}

export async function fetchAgentCapabilities(type) {
    const res = await fetch(`${BASE_URL}/agents/${type}/capabilities`);
    const data = await res.json();
    return data.data;
}
