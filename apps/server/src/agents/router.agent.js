import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const routerSystemPrompt = `You are a router agent for a customer support system. Your job is to analyze incoming customer queries and classify them into one of these categories:

1. "order" - Questions about order status, tracking, modifications, cancellations, delivery
2. "billing" - Questions about payments, refunds, invoices, subscriptions, charges
3. "support" - General support questions, FAQs, troubleshooting, how-to questions, account issues

Respond with ONLY the category name in lowercase. Nothing else.

Examples:
- "Where is my order?" -> order
- "I want a refund" -> billing
- "How do I reset my password?" -> support
- "Track my package" -> order
- "I was charged twice" -> billing`;

export async function classifyIntent(message) {
    const result = await generateText({
        model: openai('gpt-4o-mini'),
        system: routerSystemPrompt,
        prompt: message,
        maxTokens: 10,
    });

    const intent = result.text.trim().toLowerCase();

    if (['order', 'billing', 'support'].includes(intent)) {
        return intent;
    }

    return 'support';
}
