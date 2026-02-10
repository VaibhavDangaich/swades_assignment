import { tool } from 'ai';
import { z } from 'zod';
import { getMessages } from '../services/chat.service.js';

export const queryConversationHistory = tool({
    description: 'Query the conversation history to find relevant past context',
    parameters: z.object({
        conversationId: z.string().describe('The conversation ID to query'),
        searchTerm: z.string().optional().describe('Optional search term to filter messages'),
    }),
    execute: async ({ conversationId, searchTerm }) => {
        const messages = await getMessages(conversationId);

        if (!messages.length) {
            return { found: false, message: 'No conversation history found' };
        }

        let relevantMessages = messages;
        if (searchTerm) {
            relevantMessages = messages.filter(m =>
                m.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return {
            found: true,
            totalMessages: messages.length,
            relevantMessages: relevantMessages.slice(-10).map(m => ({
                role: m.role,
                content: m.content.substring(0, 200),
                agentType: m.agentType,
            })),
        };
    },
});
