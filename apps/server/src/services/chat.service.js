import { db } from '../db/index.js';
import { conversations, messages } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const DEFAULT_USER_ID = null;

export async function getOrCreateDefaultUser() {
    const result = await db.query.users.findFirst();
    return result?.id || null;
}

export async function createConversation(userId, title = 'New Conversation') {
    const [conversation] = await db.insert(conversations).values({
        userId,
        title,
    }).returning();
    return conversation;
}

export async function getConversation(conversationId) {
    return db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
    });
}

export async function getConversations(userId) {
    return db.query.conversations.findMany({
        where: eq(conversations.userId, userId),
        orderBy: [desc(conversations.updatedAt)],
    });
}

export async function deleteConversation(conversationId) {
    await db.delete(conversations).where(eq(conversations.id, conversationId));
}

export async function getMessages(conversationId) {
    return db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        orderBy: [messages.createdAt],
    });
}

export async function addMessage(conversationId, role, content, agentType = null) {
    const [message] = await db.insert(messages).values({
        conversationId,
        role,
        content,
        agentType,
    }).returning();

    await db.update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, conversationId));

    return message;
}

export async function updateConversationTitle(conversationId, title) {
    await db.update(conversations)
        .set({ title })
        .where(eq(conversations.id, conversationId));
}
