import { pgTable, text, timestamp, uuid, jsonb, integer, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    title: varchar('title', { length: 255 }).default('New Conversation'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
    role: varchar('role', { length: 20 }).notNull(),
    content: text('content').notNull(),
    agentType: varchar('agent_type', { length: 20 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    items: jsonb('items').notNull(),
    total: integer('total').notNull(),
    trackingNumber: varchar('tracking_number', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
    orderId: uuid('order_id').references(() => orders.id).notNull(),
    amount: integer('amount').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    refundStatus: varchar('refund_status', { length: 20 }).default('none'),
    invoiceUrl: text('invoice_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
