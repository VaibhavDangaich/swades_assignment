import * as chatService from '../services/chat.service.js';
import { classifyIntent } from '../agents/router.agent.js';
import { createOrderAgent } from '../agents/order.agent.js';
import { createBillingAgent } from '../agents/billing.agent.js';
import { createSupportAgent } from '../agents/support.agent.js';

export async function sendMessage(c) {
    const body = await c.req.json();
    const { content, conversationId: existingConversationId } = body;

    if (!content) {
        return c.json({ success: false, error: 'Message content is required' }, 400);
    }

    const userId = await chatService.getOrCreateDefaultUser();
    if (!userId) {
        return c.json({ success: false, error: 'No users in database. Run db:seed first.' }, 400);
    }

    let conversationId = existingConversationId;
    if (!conversationId) {
        const conversation = await chatService.createConversation(userId, content.substring(0, 50));
        conversationId = conversation.id;
    }

    await chatService.addMessage(conversationId, 'user', content);

    const intent = await classifyIntent(content);

    const messages = await chatService.getMessages(conversationId);
    const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
    }));

    let agentStream;
    switch (intent) {
        case 'order':
            agentStream = createOrderAgent(conversationHistory);
            break;
        case 'billing':
            agentStream = createBillingAgent(conversationHistory);
            break;
        default:
            agentStream = createSupportAgent(conversationHistory, conversationId);
    }

    c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');
    c.header('X-Agent-Type', intent);
    c.header('X-Conversation-Id', conversationId);

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let fullResponse = '';

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', agentType: intent, conversationId })}\n\n`));

            try {
                for await (const chunk of agentStream.textStream) {
                    fullResponse += chunk;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`));
                }

                await chatService.addMessage(conversationId, 'assistant', fullResponse, intent);

                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
                controller.close();
            } catch (error) {
                console.error('Stream error:', error);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Agent-Type': intent,
            'X-Conversation-Id': conversationId,
        },
    });
}

export async function getConversations(c) {
    const userId = await chatService.getOrCreateDefaultUser();
    if (!userId) {
        return c.json({ success: true, data: [] });
    }

    const conversations = await chatService.getConversations(userId);
    return c.json({ success: true, data: conversations });
}

export async function getConversation(c) {
    const { id } = c.req.param();

    const conversation = await chatService.getConversation(id);
    if (!conversation) {
        return c.json({ success: false, error: 'Conversation not found' }, 404);
    }

    const messages = await chatService.getMessages(id);

    return c.json({
        success: true,
        data: {
            ...conversation,
            messages,
        },
    });
}

export async function deleteConversation(c) {
    const { id } = c.req.param();

    await chatService.deleteConversation(id);
    return c.json({ success: true });
}
