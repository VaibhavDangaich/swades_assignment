import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

/**
 * Context Compaction Utility (Bonus Feature)
 * 
 * When conversation history exceeds a threshold, this utility
 * summarizes older messages to keep context within token limits
 * while preserving important information.
 */

const MAX_MESSAGES_BEFORE_COMPACT = 20;
const MESSAGES_TO_KEEP_RECENT = 6;

export async function compactContext(conversationHistory) {
    if (conversationHistory.length <= MAX_MESSAGES_BEFORE_COMPACT) {
        return conversationHistory;
    }

    const olderMessages = conversationHistory.slice(0, -MESSAGES_TO_KEEP_RECENT);
    const recentMessages = conversationHistory.slice(-MESSAGES_TO_KEEP_RECENT);

    const olderText = olderMessages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

    try {
        const { text: summary } = await generateText({
            model: openai('gpt-4o-mini'),
            messages: [
                {
                    role: 'system',
                    content: `You are a context summarizer. Summarize the following conversation history into a concise paragraph that captures all key information, decisions, and important details. Focus on:
- What the user asked about
- What information was provided
- Any order IDs, invoice numbers, or specific data mentioned
- The current state of the conversation
Keep it under 200 words.`,
                },
                {
                    role: 'user',
                    content: olderText,
                },
            ],
        });

        return [
            {
                role: 'system',
                content: `[Context Summary of earlier conversation]: ${summary}`,
            },
            ...recentMessages,
        ];
    } catch (error) {
        console.error('Context compaction failed, using truncated history:', error.message);
        return recentMessages;
    }
}

/**
 * Estimates token count for a message array.
 * Rough estimate: 1 token ≈ 4 characters.
 */
export function estimateTokens(messages) {
    return messages.reduce((total, m) => total + Math.ceil(m.content.length / 4), 0);
}
