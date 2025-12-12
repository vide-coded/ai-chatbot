# AI Chatbot

A production-ready, local-first AI chatbot application built with TanStack Start, Google Gemini, and IndexedDB.

## ✨ Features

### Core Functionality
- 💬 **Real-time streaming responses** - Smooth, character-by-character streaming from Gemini AI
- 💾 **Local-first storage** - All conversations stored in IndexedDB (privacy-focused)
- 🔄 **Multi-turn conversations** - Full context awareness with conversation history
- 📝 **Auto-save** - Messages automatically persisted as they stream
- 🎯 **Smart conversation titles** - Auto-generated from first message

### User Experience
- 🌓 **Dark/light mode** - Seamless theme switching with Linear-inspired design
- 📱 **Fully responsive** - Optimized for mobile, tablet, and desktop
- ⌨️ **Keyboard shortcuts** - Enter to send, Shift+Enter for newline
- 📋 **Copy messages** - One-click copy with visual feedback
- 🎨 **Clean UI** - No AI-generated look, professional Linear-style design

### Technical Excellence
- ⚡ **Blazing fast** - Bun runtime + TanStack optimizations
- 🛡️ **Error handling** - Comprehensive error boundaries and offline detection
- 🔒 **Rate limiting** - Built-in protection (10 req/min)
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🎭 **Loading states** - Skeletons, spinners, and smooth transitions

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | TanStack Start (React 19 SSR) |
| **Routing** | TanStack Router (file-based) |
| **AI Provider** | Google Gemini-2.0-flash |
| **AI SDK** | TanStack AI (@tanstack/ai + @tanstack/ai-react + @tanstack/ai-gemini) |
| **Database** | IndexedDB via Dexie.js 4.2.1 |
| **State Management** | TanStack Query 5 + TanStack Store |
| **UI Library** | shadcn/ui |
| **Styling** | Tailwind CSS v4 (oklch colors) |
| **Validation** | Zod 4.1.13 |
| **Runtime** | Bun 1.3.4+ |
| **Linting** | Biome |

---

## � Recent Migration: Vercel AI SDK → TanStack AI

**Date**: December 12, 2025

This project was successfully migrated from Vercel AI SDK to TanStack AI for better TanStack ecosystem integration.

**Key Changes**:
- ✅ Replaced Vercel AI SDK (`ai` + `@ai-sdk/google`) with TanStack AI
- ✅ Replaced custom `useStreamingChat` hook with built-in `useChat` from `@tanstack/ai-react`
- ✅ Server endpoint now uses `chat()` and `toStreamResponse()` from TanStack AI
- ✅ Message structure updated to support `message.parts` (text, thinking, tools)
- ✅ IndexedDB persistence maintained through callbacks
- ✅ All streaming functionality preserved

**Benefits**:
- 🎯 Consistent patterns across entire TanStack stack
- 🔧 Less custom code to maintain
- 🚀 Built-in support for advanced features (tools, multi-modal, agents)
- 📦 Smaller bundle size

See [TANSTACK_AI_REFACTOR_PLAN.md](TANSTACK_AI_REFACTOR_PLAN.md) for complete migration details.

---

## �📦 Installation

### Prerequisites

- **Bun 1.3.4+** - [Install Bun](https://bun.sh/)
- **Google Gemini API Key** - [Get key](https://ai.google.dev/)

### Quick Start

1. **Clone and install:**
```bash
bun install
```

2. **Create environment file:**
```bash
cp .env.local.example .env.local
```

3. **Add your API key to `.env.local`:**
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

4. **Start development server:**
```bash
bun run dev
```

5. **Open browser:**
```
http://localhost:3000
```

---

## 🏗️ Building For Production

```bash
bun run build
bun run start
```

Preview the production build locally:
```bash
bun run preview
```

---

## 📁 Project Structure

```
src/
├── routes/
│   ├── __root.tsx              # Root layout with providers
│   ├── index.tsx               # Main chat interface
│   └── api.chat.ts             # Gemini streaming API endpoint
├── components/
│   ├── chat/
│   │   ├── ChatMessage.tsx     # Individual message component
│   │   ├── ChatList.tsx        # Scrollable message list
│   │   └── ChatInput.tsx       # Auto-resize textarea input
│   ├── sidebar/
│   │   ├── Sidebar.tsx         # Responsive sidebar container
│   │   ├── ConversationList.tsx # List of conversations
│   │   └── NewChatButton.tsx   # Create conversation button
│   ├── layout/
│   │   ├── Header.tsx          # Top navigation bar
│   │   └── ThemeToggle.tsx     # Dark/light mode switcher
│   ├── ui/                     # shadcn/ui components
│   ├── ErrorBoundary.tsx       # Application error boundary
│   ├── ErrorMessage.tsx        # Error display component
│   ├── OfflineIndicator.tsx    # Offline state indicator
│   └── theme-provider.tsx      # Theme context provider
├── lib/
│   ├── db.ts                   # Dexie database schema
│   ├── queries.ts              # TanStack Query hooks
│   ├── store.ts                # TanStack Store (global state)
│   ├── use-streaming-chat.ts   # Streaming chat hook
│   ├── use-online-status.ts    # Online/offline detection
│   ├── api-utils.ts            # API validation & rate limiting
│   └── utils.ts                # Utility functions
└── styles.css                  # Global styles + Tailwind theme
```

---

## 🎮 Usage

### Creating a Conversation
1. Click "New Chat" button in sidebar
2. Type your message in the input field
3. Press **Enter** to send (or click send button)
4. Watch AI response stream in real-time

### Managing Conversations
- **Switch conversations**: Click conversation in sidebar
- **Delete conversation**: Click trash icon next to conversation
- **Auto-save**: All messages saved automatically

### Keyboard Shortcuts
- `Enter` - Send message
- `Shift + Enter` - New line in message
- Copy button on each message for quick copying

### Mobile Features
- Hamburger menu in header toggles sidebar
- Sidebar auto-closes after selecting conversation
- Touch-optimized interface

---

## 🛠️ Development

### Available Scripts

```bash
bun run dev          # Start dev server (port 3000)
bun run build        # Build for production
bun run start        # Start production server
bun run preview      # Preview production build locally
bun run lint         # Run Biome linter
bun run format       # Format code with Biome
bun run check        # Type check + lint
```

### Environment Variables

Create `.env.local` file:

```env
# Required - Google Gemini API key
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# Optional - Override defaults
# PORT=3000
# NODE_ENV=development
```

---

## 🎨 Design System

### Colors (Linear-Inspired)

Uses oklch color space for perceptually uniform colors:

| Color | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | `oklch(0.478 0.098 264.5)` #5E6AD2 | Same | Buttons, links, active states |
| Background | `oklch(0.99 0 0)` #FCFCFC | `oklch(0.098 0 0)` #181818 | App background |
| Muted | `oklch(0.96 0.006 264.5)` | `oklch(0.216 0.012 264.5)` | Secondary backgrounds |
| Border | `oklch(0.902 0.006 264.5)` | `oklch(0.314 0.012 264.5)` | Dividers, outlines |

### Typography

- **Font**: Inter (400, 500, 600 weights)
- **Base size**: 16px
- **Line height**: 1.5
- **Font smoothing**: Antialiased

### Spacing

Based on `0.5rem` (8px) scale:
- `p-2` = 8px
- `p-4` = 16px
- `gap-3` = 12px

### Breakpoints

- **Mobile**: < 768px (overlay sidebar)
- **Tablet**: 768px - 1023px (fixed sidebar)
- **Desktop**: ≥ 1024px (full layout)

---

## 🧪 Testing

### Manual Testing Checklist

See [RESPONSIVE_TEST.md](./RESPONSIVE_TEST.md) for comprehensive testing guide.

**Quick Tests**:
```bash
# 1. Test offline mode
# Open DevTools → Network → Set "Offline"

# 2. Test rate limiting
# Send 10+ messages rapidly

# 3. Test theme switching
# Click theme toggle in header

# 4. Test responsive layout
# Resize browser window to mobile/tablet/desktop sizes
```

### Error Scenarios

See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for full error handling documentation.

---

## 📚 Architecture

### Data Flow

1. **User Input** → ChatInput component
2. **State Update** → chatStore (TanStack Store)
3. **API Call** → /api/chat endpoint
4. **Streaming** → ReadableStream → useStreamingChat hook
5. **Persistence** → IndexedDB via Dexie.js
6. **UI Update** → TanStack Query cache invalidation

### State Management

- **Server State**: TanStack Query (conversations, messages)
- **UI State**: Local useState (input value, etc.)
- **Global State**: TanStack Store (activeConversationId, sidebar)
- **Form State**: TanStack Form (future: settings forms)

### Rate Limiting

Server-side in-memory store:
- **Limit**: 10 requests per minute per session
- **Window**: 60 seconds sliding window
- **Response**: 429 status with retry-after header

---

## 🔒 Privacy & Security

- ✅ **Local-first**: All conversations stored in browser IndexedDB
- ✅ **No tracking**: No analytics or third-party scripts
- ✅ **API key protection**: Server-side only, never exposed to client
- ✅ **Rate limiting**: Prevents abuse and excessive API costs
- ✅ **Input validation**: Zod schemas validate all inputs
- ✅ **CSRF protection**: Built into Elysia (TanStack Start uses Elysia under the hood)

---

## 🚀 Deployment

### Recommended Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
bun install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

#### Netlify
```bash
# Install Netlify CLI
bun install -g netlify-cli

# Build and deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

#### Self-Hosted (VPS)
```bash
# Build
bun run build

# Start server
bun run start

# Or use PM2 for process management
pm2 start "bun run start" --name "ai-chat"
```

---

## 🤝 Contributing

Contributions welcome! This is a learning project built following strict architectural principles.

### Guidelines

1. Follow existing code style (Biome config)
2. Use TanStack ecosystem (Query, Router, Store)
3. Maintain Linear-inspired design (no AI look)
4. Add error handling for new features
5. Update documentation

---

## 📝 License

MIT License - Feel free to use for personal or commercial projects.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [TanStack](https://tanstack.com/) - Router, Query, Store
- [Google Gemini](https://ai.google.dev/) - AI model
- [Vercel AI SDK](https://sdk.vercel.ai/) - Streaming infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Dexie.js](https://dexie.org/) - IndexedDB wrapper
- [Bun](https://bun.sh/) - Fast runtime

Inspired by Linear's design philosophy: clean, fast, purposeful.

---

## 📖 Documentation

- [RESPONSIVE_TEST.md](./RESPONSIVE_TEST.md) - Responsive testing checklist
- [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Error handling guide
- [blueprint.md](./blueprint.md) - Architecture blueprint (if exists)
- [roadmap.md](./roadmap.md) - Development roadmap (if exists)

---

## 💡 Tips

### Clearing Database
Open DevTools → Application → IndexedDB → Right-click "ChatDatabase" → Delete

### Resetting Theme
Open DevTools → Application → Local Storage → Delete "theme" key

### API Key Issues
Verify your key at https://ai.google.dev/ - ensure Gemini API is enabled

---

**Happy Chatting! 🚀**
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
