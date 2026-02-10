import { tool } from 'ai';
import { z } from 'zod';
import { db } from '../db/index.js';
import { payments, orders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getInvoiceDetails = tool({
    description: 'Get invoice details by invoice number',
    parameters: z.object({
        invoiceNumber: z.string().describe('The invoice number like INV-001'),
    }),
    execute: async ({ invoiceNumber }) => {
        const payment = await db.query.payments.findFirst({
            where: eq(payments.invoiceNumber, invoiceNumber),
        });

        if (!payment) {
            return { found: false, message: `Invoice ${invoiceNumber} not found` };
        }

        const order = await db.query.orders.findFirst({
            where: eq(orders.id, payment.orderId),
        });

        return {
            found: true,
            invoiceNumber: payment.invoiceNumber,
            amount: `$${(payment.amount / 100).toFixed(2)}`,
            status: payment.status,
            orderNumber: order?.orderNumber,
            invoiceUrl: payment.invoiceUrl,
            createdAt: payment.createdAt,
        };
    },
});

export const checkRefundStatus = tool({
    description: 'Check refund status for an invoice or order',
    parameters: z.object({
        invoiceNumber: z.string().describe('The invoice number to check refund status for'),
    }),
    execute: async ({ invoiceNumber }) => {
        const payment = await db.query.payments.findFirst({
            where: eq(payments.invoiceNumber, invoiceNumber),
        });

        if (!payment) {
            return { found: false, message: `Invoice ${invoiceNumber} not found` };
        }

        const refundMessages = {
            none: 'No refund has been requested',
            pending: 'Refund request is being reviewed (1-2 business days)',
            approved: 'Refund has been approved and is being processed',
            completed: 'Refund has been completed and credited to your account',
        };

        return {
            found: true,
            invoiceNumber: payment.invoiceNumber,
            paymentStatus: payment.status,
            refundStatus: payment.refundStatus,
            refundMessage: refundMessages[payment.refundStatus],
            amount: `$${(payment.amount / 100).toFixed(2)}`,
        };
    },
});
