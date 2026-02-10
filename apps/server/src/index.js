import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import chatRoutes from './routes/chat.routes.js';
import agentRoutes from './routes/agent.routes.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { notFound } from './middleware/error.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use('/api/*', rateLimiter);

app.get('/api/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.route('/api/chat', chatRoutes);
app.route('/api/agents', agentRoutes);

app.notFound(notFound);

app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({
        success: false,
        error: { message: err.message || 'Internal Server Error' },
    }, 500);
});

const port = process.env.PORT || 3001;

console.log(`Server running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});

export default app;
