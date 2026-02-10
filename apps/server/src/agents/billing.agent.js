import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getInvoiceDetails, checkRefundStatus } from '../tools/billing.tools.js';

const systemPrompt = `You are a Billing Support Agent for our e-commerce platform. You help customers with:
- Payment inquiries
- Refund requests and status
- Invoice questions
- Subscription and billing issues

You have access to tools to look up real payment and invoice information. Always use the tools when a customer asks about a specific invoice.

Be helpful, professional, and concise. If you look up billing info and find results, share the relevant details with the customer.

When asking for invoice numbers, mention the format is like "INV-001".`;

export function createBillingAgent(conversationHistory) {
    return streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages: conversationHistory,
        tools: {
            getInvoiceDetails,
            checkRefundStatus,
        },
        maxSteps: 3,
    });
}
