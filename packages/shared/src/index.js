export const AGENT_TYPES = {
    router: 'router',
    support: 'support',
    order: 'order',
    billing: 'billing',
};

export const AGENT_LABELS = {
    router: 'Router Agent',
    support: 'Support Agent',
    order: 'Order Agent',
    billing: 'Billing Agent',
};

export const ORDER_STATUSES = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export const PAYMENT_STATUSES = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
};

export const REFUND_STATUSES = {
    none: 'None',
    pending: 'Pending',
    approved: 'Approved',
    completed: 'Completed',
};
