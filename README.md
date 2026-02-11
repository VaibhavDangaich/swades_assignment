# 🤖 AI-Powered Customer Support System

A production-ready **multi-agent AI customer support system** with intelligent intent-based routing. Built with LangChain, OpenAI GPT-4o-mini, React, Hono.js, and PostgreSQL.

![Architecture](https://img.shields.io/badge/Architecture-Multi--Agent-blue)
![LangChain](https://img.shields.io/badge/LangChain-Few--Shot%20Prompting-green)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB)
![Hono](https://img.shields.io/badge/Backend-Hono.js-orange)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Multi-Agent System Deep Dive](#multi-agent-system-deep-dive)
- [LangChain Few-Shot Prompting](#langchain-few-shot-prompting)
- [Bonus Features](#bonus-features)
- [Testing the Application](#testing-the-application)

---

## Overview

This system intelligently routes customer queries to specialized AI agents:

| Query Type | Agent | Example Queries |
|------------|-------|-----------------|
| **Order** | Order Agent | "Where is my order?", "Track ORD-001", "Cancel my order" |
| **Billing** | Billing Agent | "I want a refund", "Check invoice INV-002", "Why was I charged?" |
| **Support** | Support Agent | "Reset password", "Return policy", "How does shipping work?" |

Each agent has access to **real database tools** to fetch actual order, invoice, and conversation data.

---

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER MESSAGE                                   │
│                         "Where is my order ORD-001?"                        │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROUTER AGENT (LangChain)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Few-Shot Prompting with 27 curated examples                        │    │
│  │  Returns: { intent: "order", confidence: 0.95, reasoning: "..." }   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────┬──────────────────┬──────────────────┬──────────────────────┘
                 │                  │                  │
        ┌────────▼────────┐ ┌───────▼───────┐ ┌───────▼───────┐
        │  ORDER AGENT    │ │ BILLING AGENT │ │ SUPPORT AGENT │
        │                 │ │               │ │               │
        │ Tools:          │ │ Tools:        │ │ Tools:        │
        │ • fetchOrder    │ │ • getInvoice  │ │ • queryHistory│
        │ • checkDelivery │ │ • checkRefund │ │               │
        └────────┬────────┘ └───────┬───────┘ └───────┬───────┘
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         POSTGRESQL DATABASE                                 │
│  Tables: users, orders, payments, conversations, messages                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Backend Architecture Pattern

```
Request → Route → Controller → Service → Agent → Tools → Database
                                  ↓
                            SSE Stream Response
```

### Frontend Architecture

```
App.jsx
├── AuthWrapper.jsx (Clerk Authentication)
├── Sidebar.jsx (Conversations List)
└── ChatContainer.jsx
    ├── MessageBubble.jsx (Markdown Support)
    └── TypingIndicator.jsx
```

---

## Tech Stack

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Hono.js** | Lightweight web framework | 4.6.x |
| **LangChain** | AI orchestration & few-shot prompting | Latest |
| **OpenAI GPT-4o-mini** | LLM for classification & responses | - |
| **Vercel AI SDK** | Streaming responses for sub-agents | 4.0.x |
| **Drizzle ORM** | Type-safe database queries | 0.38.x |
| **PostgreSQL** | Primary database | 16 |
| **Zod** | Schema validation | 3.24.x |

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 19.x |
| **Vite** | Build tool | 6.x |
| **Tailwind CSS** | Styling | 4.x |
| **Clerk** | Authentication (bonus) | Latest |
| **React Markdown** | Message rendering | 10.x |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Turborepo** | Monorepo management |
| **Docker Compose** | PostgreSQL container |
| **npm Workspaces** | Package management |

---

## Project Structure

```
swades_assignment/
├── apps/
│   ├── server/                      # 🖥️ Backend (Hono.js)
│   │   ├── src/
│   │   │   ├── index.js             # Server entry point
│   │   │   ├── agents/
│   │   │   │   ├── router.agent.js  # LangChain few-shot router
│   │   │   │   ├── order.agent.js   # Order handling agent
│   │   │   │   ├── billing.agent.js # Billing handling agent
│   │   │   │   └── support.agent.js # General support agent
│   │   │   ├── tools/
│   │   │   │   ├── order.tools.js   # fetchOrderDetails, checkDeliveryStatus
│   │   │   │   ├── billing.tools.js # getInvoiceDetails, checkRefundStatus
│   │   │   │   └── support.tools.js # queryConversationHistory
│   │   │   ├── controllers/
│   │   │   │   ├── chat.controller.js    # Message handling & SSE
│   │   │   │   └── agent.controller.js   # Agent info endpoints
│   │   │   ├── services/
│   │   │   │   ├── chat.service.js       # Conversation CRUD
│   │   │   │   └── agent.service.js      # Agent metadata
│   │   │   ├── routes/
│   │   │   │   ├── chat.routes.js        # /api/chat/*
│   │   │   │   └── agent.routes.js       # /api/agents/*
│   │   │   ├── middleware/
│   │   │   │   ├── rateLimit.js          # 100 req/min per IP
│   │   │   │   └── error.js              # Error handling
│   │   │   ├── db/
│   │   │   │   ├── index.js              # Drizzle connection
│   │   │   │   ├── schema.js             # Table definitions
│   │   │   │   └── seed.js               # Sample data
│   │   │   └── utils/
│   │   │       └── contextCompaction.js  # Long conversation summarization
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── web/                         # 🌐 Frontend (React)
│       ├── src/
│       │   ├── main.jsx             # Entry with AuthProvider
│       │   ├── App.jsx              # Main layout
│       │   ├── index.css            # Tailwind + custom styles
│       │   ├── components/
│       │   │   ├── AuthWrapper.jsx      # Clerk auth wrapper
│       │   │   ├── Sidebar.jsx          # Conversation list
│       │   │   ├── ChatContainer.jsx    # Chat UI + SSE handling
│       │   │   ├── MessageBubble.jsx    # Message with markdown
│       │   │   ├── TypingIndicator.jsx  # Loading animation
│       │   │   └── ErrorBoundary.jsx    # Error handling
│       │   └── lib/
│       │       └── api.js           # API client functions
│       ├── index.html
│       ├── vite.config.js
│       ├── package.json
│       └── .env.example
│
├── packages/
│   └── shared/                      # 📦 Shared utilities
│       └── src/index.js
│
├── docker-compose.yml               # PostgreSQL container
├── turbo.json                       # Turborepo config
├── package.json                     # Root package.json
└── README.md
```

---

## Setup & Installation

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **Docker** & Docker Compose (for PostgreSQL)
- **OpenAI API Key** (get from [platform.openai.com](https://platform.openai.com))
- **Clerk Account** (optional, for authentication - [clerk.com](https://clerk.com))

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/VaibhavDangaich/swades_assignment.git
cd swades_assignment

# Install all dependencies (uses npm workspaces)
npm install
```

### Step 2: Start PostgreSQL Database

```bash
# Start PostgreSQL in Docker
docker compose up -d

# Verify it's running
docker ps
# Should show: support-db (postgres:16-alpine)
```

**Database Connection:**
- Host: `localhost`
- Port: `5433` (mapped to container's 5432)
- Database: `support`
- User: `postgres`
- Password: `postgres`

### Step 3: Configure Environment Variables

**Backend (`apps/server/.env`):**

```bash
# Copy example file
cp apps/server/.env.example apps/server/.env

# Edit with your values
nano apps/server/.env
```

```env
# Required
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/support
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional
PORT=3001
```

**Frontend (`apps/web/.env`):** *(Optional - for Clerk auth)*

```bash
cp apps/web/.env.example apps/web/.env
```

```env
# Optional - Get from Clerk Dashboard
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key-here
```

### Step 4: Initialize Database

```bash
# Push schema to PostgreSQL
cd apps/server
npx drizzle-kit push

# Seed with sample data
node src/db/seed.js

# Go back to root
cd ../..
```

### Step 5: Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

**Access the application:**
- 🌐 **Frontend:** http://localhost:5173
- 🖥️ **Backend:** http://localhost:3001
- ❤️ **Health Check:** http://localhost:3001/api/health

---

## Environment Variables

### Backend (`apps/server/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/support` |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for GPT-4o-mini | `sk-...` |
| `PORT` | ❌ | Server port (default: 3001) | `3001` |

### Frontend (`apps/web/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | ❌ | Clerk publishable key for auth | `pk_test_...` |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   users     │       │  conversations  │       │  messages   │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ userId (FK)     │       │ id (PK)     │
│ email       │       │ id (PK)         │◄──────│ convId (FK) │
│ name        │       │ title           │       │ role        │
│ createdAt   │       │ createdAt       │       │ content     │
└─────────────┘       │ updatedAt       │       │ agentType   │
      │               └─────────────────┘       │ createdAt   │
      │                                         └─────────────┘
      │
      ▼
┌─────────────┐       ┌─────────────────┐
│   orders    │       │    payments     │
├─────────────┤       ├─────────────────┤
│ id (PK)     │◄──────│ orderId (FK)    │
│ userId (FK) │       │ id (PK)         │
│ orderNumber │       │ invoiceNumber   │
│ status      │       │ amount          │
│ items (JSON)│       │ status          │
│ total       │       │ refundStatus    │
│ trackingNum │       │ invoiceUrl      │
│ createdAt   │       │ createdAt       │
└─────────────┘       └─────────────────┘
```

### Table Definitions

**users**
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
email       VARCHAR(255) NOT NULL UNIQUE
name        VARCHAR(255) NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
```

**orders**
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_number    VARCHAR(50) NOT NULL UNIQUE  -- e.g., "ORD-001"
user_id         UUID REFERENCES users(id)
status          VARCHAR(20) DEFAULT 'pending'  -- pending, processing, shipped, delivered, cancelled
items           JSONB NOT NULL  -- [{name, quantity, price}]
total           INTEGER NOT NULL  -- cents
tracking_number VARCHAR(100)
created_at      TIMESTAMP DEFAULT NOW()
```

**payments**
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
invoice_number  VARCHAR(50) NOT NULL UNIQUE  -- e.g., "INV-001"
order_id        UUID REFERENCES orders(id)
amount          INTEGER NOT NULL  -- cents
status          VARCHAR(20) DEFAULT 'pending'  -- pending, completed, failed
refund_status   VARCHAR(20) DEFAULT 'none'  -- none, pending, approved, completed
invoice_url     TEXT
created_at      TIMESTAMP DEFAULT NOW()
```

### Seed Data

The `seed.js` creates sample data for testing:

| Entity | Examples |
|--------|----------|
| **Users** | john@example.com, jane@example.com |
| **Orders** | ORD-001 (shipped), ORD-002 (delivered), ORD-003 (processing) |
| **Payments** | INV-001 (paid), INV-002 (refund pending), INV-003 (pending) |

---

## API Reference

### Base URL
```
http://localhost:3001/api
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```

### Chat Endpoints

#### Send Message (SSE Streaming)

```http
POST /chat/messages
Content-Type: application/json

{
  "content": "Where is my order ORD-001?",
  "conversationId": "uuid-optional"  // omit for new conversation
}
```

**SSE Response Stream:**
```
data: {"type": "start", "agentType": "order", "conversationId": "uuid"}

data: {"type": "text", "content": "Let me look up "}

data: {"type": "text", "content": "your order..."}

data: {"type": "done"}
```

#### Get Conversation

```http
GET /chat/conversations/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Order inquiry",
    "createdAt": "2026-02-11T12:00:00.000Z",
    "messages": [
      {"id": "uuid", "role": "user", "content": "...", "agentType": null},
      {"id": "uuid", "role": "assistant", "content": "...", "agentType": "order"}
    ]
  }
}
```

#### List Conversations

```http
GET /chat/conversations
```

#### Delete Conversation

```http
DELETE /chat/conversations/:id
```

### Agent Endpoints

#### List Agents

```http
GET /agents
```

**Response:**
```json
{
  "success": true,
  "data": [
    {"type": "router", "name": "Router Agent", "description": "..."},
    {"type": "order", "name": "Order Agent", "description": "..."},
    {"type": "billing", "name": "Billing Agent", "description": "..."},
    {"type": "support", "name": "Support Agent", "description": "..."}
  ]
}
```

#### Get Agent Capabilities

```http
GET /agents/:type/capabilities
```

---

## Multi-Agent System Deep Dive

### 1. Router Agent (`router.agent.js`)

**Purpose:** Classifies incoming messages into `order`, `billing`, or `support` intents.

**Implementation:**
- Uses **LangChain** with **ChatOpenAI** (GPT-4o-mini)
- **Few-shot prompting** with 27 curated examples
- Returns structured JSON with confidence scores
- Falls back to keyword matching if LangChain fails

**Classification Rules (built into prompt):**
1. Refund/money requests → `billing` (even if order mentioned)
2. "How to" questions → `support` (not order tracking)
3. Specific order status → `order`
4. Ambiguous → `support` (safe default)

### 2. Order Agent (`order.agent.js`)

**Purpose:** Handles order-related queries with real database access.

**System Prompt:**
```
You are an Order Support Agent for our e-commerce platform. You help customers with:
- Order status inquiries
- Delivery tracking
- Order modifications
- Cancellation requests

When asking for order numbers, mention the format is like "ORD-001".
```

**Available Tools:**

| Tool | Description | Parameters |
|------|-------------|------------|
| `fetchOrderDetails` | Get order info by order number | `orderNumber: string` |
| `checkDeliveryStatus` | Get delivery status & tracking | `orderNumber: string` |

### 3. Billing Agent (`billing.agent.js`)

**Purpose:** Handles payment and refund queries with real database access.

**Available Tools:**

| Tool | Description | Parameters |
|------|-------------|------------|
| `getInvoiceDetails` | Get invoice by invoice number | `invoiceNumber: string` |
| `checkRefundStatus` | Get refund status for invoice | `invoiceNumber: string` |

### 4. Support Agent (`support.agent.js`)

**Purpose:** Handles general FAQs and account issues.

**Built-in Knowledge:**
- Password reset: "Go to Settings > Security > Reset Password"
- Account deletion: "Contact support to request account deletion"
- Return policy: "We offer 30-day returns on most items"
- Shipping: "Standard shipping takes 3-5 business days"

**Available Tools:**

| Tool | Description | Parameters |
|------|-------------|------------|
| `queryConversationHistory` | Search past messages for context | `searchTerm: string` |

---

## LangChain Few-Shot Prompting

### Why Few-Shot Prompting?

| Simple Prompting | Few-Shot Prompting |
|------------------|-------------------|
| 5 basic examples | 27 curated examples |
| No edge cases | Handles ambiguous queries |
| No confidence scores | Returns 0-1 confidence |
| Inconsistent output | Structured JSON output |

### Implementation Details

**File:** `apps/server/src/agents/router.agent.js`

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// 27 few-shot examples covering edge cases
const fewShotExamples = [
    // ORDER EXAMPLES
    { input: "Where is my order?", intent: "order", reasoning: "Order status inquiry" },
    { input: "Track my shipment", intent: "order", reasoning: "Package tracking" },
    
    // BILLING EXAMPLES - Note: "order was wrong" + "money back" = billing
    { input: "My order was wrong and I want my money back", intent: "billing", reasoning: "Refund takes priority" },
    
    // SUPPORT EXAMPLES - Note: "how do I track" is a how-to, not tracking
    { input: "How do I track orders on this website?", intent: "support", reasoning: "How-to question" },
    // ... 23 more examples
];
```

**Response Format:**
```json
{
  "intent": "order",
  "confidence": 0.95,
  "reasoning": "User asking about specific order status"
}
```

### Classification Logging

Server logs show classification details:
```
[Router] Intent: billing (95%) - Refund request takes priority over order issue
[Router] Intent: support (87%) - How-to question, not actual tracking
```

---

## Bonus Features

### 1. 🔐 Clerk Authentication

**File:** `apps/web/src/components/AuthWrapper.jsx`

- Optional authentication using Clerk
- Beautiful sign-in page with branding
- Works without Clerk key (graceful fallback)
- `UserButton` component in sidebar

**Setup:**
1. Create account at [clerk.com](https://clerk.com)
2. Get Publishable Key from Dashboard
3. Add to `apps/web/.env`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

### 2. 📝 Context Compaction

**File:** `apps/server/src/utils/contextCompaction.js`

When conversations exceed 20 messages, older messages are summarized by AI to prevent token limit issues:

```javascript
// Before: 25 messages
// After: [AI-generated summary] + 6 recent messages
```

### 3. 🚦 Rate Limiting

**File:** `apps/server/src/middleware/rateLimit.js`

- **100 requests per minute** per IP address
- In-memory sliding window
- Returns 429 status when exceeded

### 4. 📡 Server-Sent Events (SSE)

Real-time streaming responses:

```javascript
// Frontend receives chunks as they're generated
data: {"type": "text", "content": "Let me "}
data: {"type": "text", "content": "check that "}
data: {"type": "text", "content": "for you..."}
```

### 5. 💬 Typing Indicator

Animated typing indicator with random status words:
- "Thinking..."
- "Analyzing..."
- "Processing..."

### 6. 🎨 Modern UI

- Dark theme with violet accents
- Markdown rendering in messages
- Hover effects and animations
- Responsive sidebar

---

## Testing the Application

### Test Queries by Intent

**Order Agent:**
```
"Where is my order ORD-001?"
"Track my package"
"Cancel my order ORD-002"
"When will my delivery arrive?"
```

**Billing Agent:**
```
"I want a refund"
"Check refund status for INV-002"
"I was charged twice"
"Where is my invoice?"
```

**Support Agent:**
```
"How do I reset my password?"
"What's your return policy?"
"Delete my account"
"How does shipping work?"
```

**Edge Cases (tests few-shot prompting):**
```
"My order was wrong and I want my money back"  → billing (refund priority)
"How do I track orders on this website?"       → support (how-to question)
```

### Expected Database Results

| Query | Tool Called | Expected Data |
|-------|-------------|---------------|
| "Where is ORD-001?" | `fetchOrderDetails` | Wireless Headphones, shipped, $99.99 |
| "Check INV-002 refund" | `checkRefundStatus` | Refund pending, 1-2 business days |
| "Track ORD-003" | `checkDeliveryStatus` | Processing, tracking not yet available |

---

## Troubleshooting

### Common Issues

**1. Database connection failed**
```bash
# Make sure PostgreSQL is running
docker compose up -d

# Check connection
docker exec -it support-db psql -U postgres -d support -c "SELECT 1"
```

**2. OpenAI API errors**
- Verify `OPENAI_API_KEY` in `apps/server/.env`
- Check API key has credits at [platform.openai.com](https://platform.openai.com)

**3. Port already in use**
```bash
# Kill processes on ports 3001 and 5173
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**4. Dependencies not found**
```bash
# Clean install
rm -rf node_modules apps/*/node_modules
npm install
```

---

## License

MIT

---

## Author

Built by [Vaibhav Dangaich](https://github.com/VaibhavDangaich)
