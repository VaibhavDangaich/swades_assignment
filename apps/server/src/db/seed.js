import { db } from './index.js';
import { users, orders, payments, conversations, messages } from './schema.js';

async function seed() {
    console.log('Seeding database...');

    const [user1] = await db.insert(users).values([
        { email: 'john@example.com', name: 'John Doe' },
        { email: 'jane@example.com', name: 'Jane Smith' },
    ]).returning();

    const [order1, order2, order3] = await db.insert(orders).values([
        {
            orderNumber: 'ORD-001',
            userId: user1.id,
            status: 'shipped',
            items: [{ name: 'Wireless Headphones', quantity: 1, price: 9999 }],
            total: 9999,
            trackingNumber: 'TRK-123456789',
        },
        {
            orderNumber: 'ORD-002',
            userId: user1.id,
            status: 'delivered',
            items: [{ name: 'USB-C Cable', quantity: 2, price: 1999 }],
            total: 3998,
            trackingNumber: 'TRK-987654321',
        },
        {
            orderNumber: 'ORD-003',
            userId: user1.id,
            status: 'processing',
            items: [{ name: 'Mechanical Keyboard', quantity: 1, price: 14999 }],
            total: 14999,
            trackingNumber: null,
        },
    ]).returning();

    await db.insert(payments).values([
        {
            invoiceNumber: 'INV-001',
            orderId: order1.id,
            amount: 9999,
            status: 'completed',
            refundStatus: 'none',
            invoiceUrl: 'https://invoices.example.com/INV-001',
        },
        {
            invoiceNumber: 'INV-002',
            orderId: order2.id,
            amount: 3998,
            status: 'completed',
            refundStatus: 'pending',
            invoiceUrl: 'https://invoices.example.com/INV-002',
        },
        {
            invoiceNumber: 'INV-003',
            orderId: order3.id,
            amount: 14999,
            status: 'pending',
            refundStatus: 'none',
            invoiceUrl: null,
        },
    ]);

    const [conv1] = await db.insert(conversations).values([
        { userId: user1.id, title: 'Order inquiry' },
    ]).returning();

    await db.insert(messages).values([
        { conversationId: conv1.id, role: 'user', content: 'Hi, I need help with my order' },
        { conversationId: conv1.id, role: 'assistant', content: 'Hello! I\'d be happy to help. Could you provide your order number?', agentType: 'support' },
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
