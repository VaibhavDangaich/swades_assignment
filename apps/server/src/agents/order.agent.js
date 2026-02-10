import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { fetchOrderDetails, checkDeliveryStatus } from '../tools/order.tools.js';

const systemPrompt = `You are an Order Support Agent for our e-commerce platform. You help customers with:
- Order status inquiries
- Delivery tracking
- Order modifications
- Cancellation requests

You have access to tools to look up real order information. Always use the tools when a customer asks about a specific order.

Be helpful, professional, and concise. If you look up an order and find information, share the relevant details with the customer.

When asking for order numbers, mention the format is like "ORD-001".`;

export function createOrderAgent(conversationHistory) {
    return streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages: conversationHistory,
        tools: {
            fetchOrderDetails,
            checkDeliveryStatus,
        },
        maxSteps: 3,
    });
}
