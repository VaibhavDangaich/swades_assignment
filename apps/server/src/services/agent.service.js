const agents = {
    router: {
        name: 'Router Agent',
        description: 'Analyzes incoming queries and routes to appropriate sub-agent',
        tools: ['classifyIntent'],
    },
    support: {
        name: 'Support Agent',
        description: 'Handles general support inquiries, FAQs, and troubleshooting',
        tools: ['queryConversationHistory'],
    },
    order: {
        name: 'Order Agent',
        description: 'Handles order status, tracking, modifications, and cancellations',
        tools: ['fetchOrderDetails', 'checkDeliveryStatus'],
    },
    billing: {
        name: 'Billing Agent',
        description: 'Handles payment issues, refunds, invoices, and subscription queries',
        tools: ['getInvoiceDetails', 'checkRefundStatus'],
    },
};

export function listAgents() {
    return Object.entries(agents).map(([type, agent]) => ({
        type,
        name: agent.name,
        description: agent.description,
    }));
}

export function getAgentCapabilities(type) {
    const agent = agents[type];
    if (!agent) return null;

    return {
        type,
        ...agent,
    };
}
