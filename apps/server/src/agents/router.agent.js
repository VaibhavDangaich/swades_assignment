import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const fewShotExamples = [
    { input: "Where is my order?", intent: "order", reasoning: "Asking about order location/status" },
    { input: "I want to cancel my order ORD-123", intent: "order", reasoning: "Order cancellation request" },
    { input: "When will my package arrive?", intent: "order", reasoning: "Delivery timing inquiry" },
    { input: "Track my shipment", intent: "order", reasoning: "Package tracking request" },
    { input: "Can I change the delivery address?", intent: "order", reasoning: "Order modification request" },
    { input: "My order hasn't arrived yet", intent: "order", reasoning: "Missing/delayed delivery" },
    { input: "What's the status of order ORD-001?", intent: "order", reasoning: "Specific order status inquiry" },
    { input: "I received the wrong item", intent: "order", reasoning: "Order fulfillment issue" },
    { input: "I want a refund", intent: "billing", reasoning: "Refund request" },
    { input: "I was charged twice", intent: "billing", reasoning: "Duplicate charge complaint" },
    { input: "Where is my invoice?", intent: "billing", reasoning: "Invoice request" },
    { input: "Check refund status for INV-002", intent: "billing", reasoning: "Refund status with invoice number" },
    { input: "Why was I charged $50?", intent: "billing", reasoning: "Charge explanation request" },
    { input: "Update my payment method", intent: "billing", reasoning: "Payment method management" },
    { input: "Cancel my subscription", intent: "billing", reasoning: "Subscription billing issue" },
    { input: "I need a receipt for my purchase", intent: "billing", reasoning: "Receipt/invoice request" },
    { input: "My order was wrong and I want my money back", intent: "billing", reasoning: "Refund takes priority" },
    { input: "How do I reset my password?", intent: "support", reasoning: "Account FAQ" },
    { input: "I can't log into my account", intent: "support", reasoning: "Login issue" },
    { input: "What's your return policy?", intent: "support", reasoning: "Policy information" },
    { input: "How does shipping work?", intent: "support", reasoning: "General shipping FAQ" },
    { input: "Delete my account", intent: "support", reasoning: "Account management" },
    { input: "What products do you sell?", intent: "support", reasoning: "General product inquiry" },
    { input: "Hello, I need help", intent: "support", reasoning: "General greeting" },
    { input: "How do I track orders on this website?", intent: "support", reasoning: "How-to question, not actual tracking" },
    { input: "Do you ship internationally?", intent: "support", reasoning: "General policy question" },
];

function buildSystemPrompt() {
    const examplesText = fewShotExamples
        .map(ex => `Customer: "${ex.input}"\nIntent: ${ex.intent}\nReasoning: ${ex.reasoning}`)
        .join('\n\n');

    return `You are an expert intent classifier for a customer support system. Analyze customer messages and classify them into exactly ONE of these categories:

**Categories:**
1. "order" - Questions about specific orders, tracking, delivery status, order modifications, cancellations, missing packages, wrong items
2. "billing" - Questions about payments, charges, refunds, invoices, subscriptions, payment methods, pricing, receipts
3. "support" - General questions, FAQs, account issues, how-to questions, policy inquiries, product info, login problems

**Classification Rules:**
- If the query mentions refunds or money back → "billing" (even if order is mentioned)
- If asking "how to" do something in general → "support"
- If about a specific order's status/tracking/delivery → "order"
- When ambiguous → "support"

**Few-Shot Examples:**
${examplesText}

**Response Format:**
Respond with ONLY a JSON object in this exact format (no markdown, no explanation):
{"intent": "order|billing|support", "confidence": 0.0-1.0, "reasoning": "brief explanation"}`;
}

const systemPrompt = buildSystemPrompt();

const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0,
    maxTokens: 100,
});

export async function classifyIntent(message) {
    try {
        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(`Customer: "${message}"\n\nClassify this message. Respond with JSON only.`),
        ]);

        const content = response.content.trim();
        let jsonStr = content;
        if (content.includes('```')) {
            const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            jsonStr = match ? match[1] : content;
        }
        
        const parsed = JSON.parse(jsonStr);
        
        console.log(`[Router] Intent: ${parsed.intent} (${Math.round(parsed.confidence * 100)}%) - ${parsed.reasoning}`);

        if (parsed.confidence >= 0.6 && ['order', 'billing', 'support'].includes(parsed.intent)) {
            return parsed.intent;
        }

        console.log(`[Router] Low confidence, defaulting to support`);
        return 'support';

    } catch (error) {
        console.error('[Router] Classification error:', error.message);
        return fallbackClassify(message);
    }
}

function fallbackClassify(message) {
    const lower = message.toLowerCase();

    const billingKeywords = ['refund', 'invoice', 'payment', 'charge', 'money', 'bill', 'subscription', 'price', 'cost', 'receipt', 'charged'];
    const orderKeywords = ['order', 'track', 'delivery', 'package', 'shipping', 'shipped', 'arrived', 'cancel order', 'ord-'];

    if (billingKeywords.some(k => lower.includes(k))) return 'billing';
    if (orderKeywords.some(k => lower.includes(k))) return 'order';

    return 'support';
}

export async function classifyIntentWithDetails(message) {
    try {
        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(`Customer: "${message}"\n\nClassify this message. Respond with JSON only.`),
        ]);

        const content = response.content.trim();
        let jsonStr = content;
        if (content.includes('```')) {
            const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            jsonStr = match ? match[1] : content;
        }

        const parsed = JSON.parse(jsonStr);

        return {
            intent: parsed.intent,
            confidence: parsed.confidence,
            reasoning: parsed.reasoning,
            success: true,
        };
    } catch (error) {
        return {
            intent: fallbackClassify(message),
            confidence: 0.5,
            reasoning: 'Fallback keyword matching used',
            success: false,
            error: error.message,
        };
    }
}
