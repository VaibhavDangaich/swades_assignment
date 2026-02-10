import { tool } from 'ai';
import { z } from 'zod';
import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const fetchOrderDetails = tool({
    description: 'Fetch order details by order number. Use this when user asks about a specific order.',
    parameters: z.object({
        orderNumber: z.string().describe('The order number like ORD-001'),
    }),
    execute: async ({ orderNumber }) => {
        const order = await db.query.orders.findFirst({
            where: eq(orders.orderNumber, orderNumber),
        });

        if (!order) {
            return { found: false, message: `Order ${orderNumber} not found` };
        }

        return {
            found: true,
            orderNumber: order.orderNumber,
            status: order.status,
            items: order.items,
            total: `$${(order.total / 100).toFixed(2)}`,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
        };
    },
});

export const checkDeliveryStatus = tool({
    description: 'Check delivery status and tracking info for an order',
    parameters: z.object({
        orderNumber: z.string().describe('The order number to check delivery status for'),
    }),
    execute: async ({ orderNumber }) => {
        const order = await db.query.orders.findFirst({
            where: eq(orders.orderNumber, orderNumber),
        });

        if (!order) {
            return { found: false, message: `Order ${orderNumber} not found` };
        }

        const statusMessages = {
            pending: 'Order is being prepared',
            processing: 'Order is being processed and will ship soon',
            shipped: 'Order has been shipped and is on the way',
            delivered: 'Order has been delivered',
            cancelled: 'Order was cancelled',
        };

        return {
            found: true,
            orderNumber: order.orderNumber,
            status: order.status,
            statusMessage: statusMessages[order.status],
            trackingNumber: order.trackingNumber || 'Not yet available',
            estimatedDelivery: order.status === 'shipped' ? '2-3 business days' : null,
        };
    },
});
