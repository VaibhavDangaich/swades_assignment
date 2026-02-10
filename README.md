# AI-Powered Customer Support System

Multi-agent AI customer support system with intent-based routing. A router agent classifies queries and delegates to specialized sub-agents (Order, Billing, Support), each with access to database-backed tools.

## Architecture

```
User Message → Router Agent → classifies intent
                ├── "order"   → Order Agent   → fetchOrderDetails, checkDeliveryStatus
                ├── "billing" → Billing Agent  → getInvoiceDetails, checkRefundStatus
                └── "support" → Support Agent  → queryConversationHistory
```

**Pattern**: Controller → Service → Agent → Tools → Database

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Hono.js (Node.js)
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Vercel AI SDK + OpenAI GPT-4o-mini
- **Monorepo**: Turborepo + npm workspaces

## Project Structure

```
├── apps/
│   ├── server/          # Hono backend
│   │   ├── src/
│   │   │   ├── agents/       # AI agents (router, order, billing, support)
│   │   │   ├── tools/        # Agent tools (DB queries)
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── routes/       # API route definitions
│   │   │   ├── middleware/   # Error handling, rate limiting
│   │   │   └── db/           # Schema, connection, seed
│   │   └── package.json
│   └── web/             # React frontend
│       ├── src/
│       │   ├── components/   # Chat UI components
│       │   └── lib/          # API helper
│       └── package.json
├── packages/
│   └── shared/          # Shared types
├── turbo.json
└── docker-compose.yml
```

## Setup

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)
- OpenAI API Key

### 1. Install dependencies
```bash
npm install
```

### 2. Start PostgreSQL
```bash
docker compose up -d
```

### 3. Configure environment
```bash
cp apps/server/.env.example apps/server/.env
# Edit .env and add your OPENAI_API_KEY
```

### 4. Push schema & seed database
```bash
cd apps/server
npx drizzle-kit push
node src/db/seed.js
```

### 5. Start dev servers
```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

## API Routes

```
/api
├── /chat
│   ├── POST   /messages              # Send message (SSE streaming)
│   ├── GET    /conversations/:id     # Get conversation with messages
│   ├── GET    /conversations         # List all conversations
│   └── DELETE /conversations/:id     # Delete conversation
├── /agents
│   ├── GET    /                      # List available agents
│   └── GET    /:type/capabilities    # Get agent capabilities
└── /health                           # Health check
```

## Multi-Agent System

### Router Agent
Analyzes incoming queries and classifies intent into: `order`, `billing`, or `support`. Uses GPT-4o-mini for fast classification.

### Order Agent
Handles order status, tracking, modifications. Tools query real order data from PostgreSQL.

### Billing Agent
Handles payment issues, refunds, invoices. Tools query real payment data from PostgreSQL.

### Support Agent
Handles general support, FAQs, troubleshooting. Has access to conversation history for context.

## Bonus Features
- Rate limiting middleware
- Streaming responses (SSE)
- Typing indicator with random status words
- Conversation context persistence
- Turborepo monorepo setup
