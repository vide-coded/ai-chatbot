# AI Chatbot Blueprint

## Project Overview
A local-first AI chatbot web application using TanStack Start, Gemini-pro LLM, and IndexedDB for persistent chat history. Linear-inspired design with streaming responses and multi-turn conversation support.

---

## Business Goals
- Provide a privacy-focused, local-first AI chat experience
- Enable offline chat history access
- Deliver real-time streaming responses
- Support contextual multi-turn conversations

---

## Technical Architecture

### Frontend Stack
- **Framework:** TanStack Start (React SSR)
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** 
  - TanStack Query (server state)
  - TanStack Store (client state)
- **Forms:** TanStack Form + Zod
- **Runtime:** Bun

### Backend Stack
- **API Routes:** TanStack Start API routes
- **LLM Integration:** TanStack AI + Google Gemini-pro
- **Rate Limiting:** Custom middleware
- **Validation:** Zod schemas

### Data Layer
- **Primary Storage:** IndexedDB via Dexie.js
- **Structure:**
  - Conversations (id, title, createdAt, updatedAt)
  - Messages (id, conversationId, role, content, timestamp)
- **Sync Strategy:** Local-first, no cloud sync for MVP

### Security
- API key stored in `.env.local`
- Rate limiting: 10 requests/minute per session
- Input sanitization via Zod
- No user authentication in MVP (single-user, local-only)

---

## Feature Breakdown

### MVP Features (Critical Path)
1. **Chat Interface**
   - Message input with auto-resize textarea
   - Message list with user/AI distinction
   - Streaming response display
   - Loading states

2. **Conversation Management**
   - Create new conversation
   - List conversations in sidebar
   - Switch between conversations
   - Delete conversations

3. **LLM Integration**
   - Gemini-pro API connection
   - Streaming response handling
   - Context management (last 10 messages)
   - Error handling

4. **Local Storage**
   - IndexedDB schema setup
   - Save messages on send/receive
   - Load conversation history
   - Persist across sessions

5. **UI/UX**
   - Linear-inspired design system
   - Dark/light mode toggle
   - Responsive layout (mobile-first)
   - Keyboard shortcuts (Cmd+N for new chat)

### Post-MVP Features
- Export conversations (JSON/Markdown)
- Search within conversations
- Custom system prompts
- Token usage tracking
- Conversation sharing via URL
- Multi-model support (GPT, Claude)
- Voice input/output
- Image upload support (Gemini-pro-vision)

---

## Data Models

### Conversation
```typescript
interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: 'gemini-pro';
}
```

### Message
```typescript
interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
```

---

## API Routes

### POST /api/chat
**Request:**
```typescript
{
  conversationId: string;
  messages: Array<{ role: string; content: string }>;
}
```

**Response:** Streaming Server-Sent Events (SSE)
```typescript
data: { type: 'token', content: string }
data: { type: 'done', messageId: string }
data: { type: 'error', message: string }
```

---

## Component Structure

```
app/
├── routes/
│   ├── __root.tsx           # Root layout with theme provider
│   ├── index.tsx            # Chat interface
│   └── api/
│       └── chat.ts          # Gemini streaming endpoint
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatList.tsx
│   │   └── StreamingText.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── ConversationList.tsx
│   │   └── NewChatButton.tsx
│   └── layout/
│       ├── ThemeToggle.tsx
│       └── Header.tsx
├── lib/
│   ├── db.ts                # Dexie.js database
│   ├── ai.ts                # TanStack AI client
│   ├── store.ts             # TanStack Store
│   └── utils.ts
└── styles/
    └── globals.css
```

---

## Design System (Linear-Inspired)

### Colors
- **Background:** 
  - Light: `#FAFAFA`, `#FFFFFF`
  - Dark: `#0D0D0D`, `#1A1A1A`
- **Text:**
  - Primary: `#0D0D0D` / `#FAFAFA`
  - Secondary: `#6B7280` / `#9CA3AF`
- **Accent:** `#5E6AD2` (Linear blue)
- **Border:** `#E5E7EB` / `#2D2D2D`

### Typography
- **Font:** Inter (sans-serif)
- **Sizes:** 14px (body), 12px (small), 16px (large)
- **Weight:** 400 (normal), 500 (medium), 600 (semibold)

### Spacing
- **Unit:** 4px base (Tailwind scale)
- **Gaps:** 8px, 16px, 24px, 32px

### Animations
- **Subtle:** fade-in, slide-in
- **Duration:** 150ms, 200ms
- **Easing:** ease-out

---

## Performance Targets
- **Initial Load:** < 2.5s
- **Streaming Latency:** < 500ms to first token
- **Message Save:** < 50ms
- **Conversation Load:** < 100ms
- **Lighthouse Score:** > 90

---

## Accessibility (WCAG 2.1 AA)
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels on all interactive elements
- Focus indicators with clear contrast
- Screen reader announcements for streaming
- Color contrast ratio > 4.5:1

---

## Development Workflow
1. **Setup:** Bun, TanStack Start, shadcn/ui
2. **Core:** Database schema, API route, streaming
3. **UI:** Chat interface, sidebar, theme toggle
4. **Integration:** Connect UI to API and DB
5. **Polish:** Responsive design, animations, error states
6. **Testing:** Manual testing, edge cases

---

## Risk Assessment

### Technical Risks
- **High:** IndexedDB compatibility (Safari issues)
  - *Mitigation:* Use Dexie.js with fallback to localStorage
- **Medium:** Streaming response stability
  - *Mitigation:* Implement retry logic and timeout handling
- **Low:** Rate limiting bypass
  - *Mitigation:* Server-side session tracking

### Business Risks
- **Low:** User adoption (MVP scope)
  - *Mitigation:* Focus on core value (fast, private chat)

---

## Success Metrics
- Chat message send/receive works 99% of time
- Streaming response starts within 500ms
- Conversations persist across browser sessions
- No data loss on page refresh
- Works on mobile, tablet, desktop

---

## Timeline Estimate
- **Setup & Architecture:** 1 task
- **Database & API:** 2-3 tasks
- **UI Components:** 3-4 tasks
- **Integration & Polish:** 2-3 tasks
- **Total:** ~10-12 tasks (MVP)

---

**Status:** 📋 Blueprint Approved  
**Last Updated:** December 11, 2025
