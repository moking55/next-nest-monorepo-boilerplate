---
name: socket-frontend-usage
description: Add Socket.io client support to Next.js frontend. Covers context provider setup, useSocket hook, event handling patterns, and real-time communication with the NestJS backend.
author: Antigravity
---

# Frontend Socket.io Usage Skill

This skill covers adding real-time WebSocket communication to the `apps/frontend` Next.js app using Socket.io client.

## Architecture

```
apps/frontend/src/
├── contexts/
│   └── socket-context.tsx       # SocketProvider + SocketContext
├── hooks/
│   ├── use-socket/              # Consumer hook (reads from context)
│   └── use-hello/               # Example: hello event logic
├── containers/
│   └── hello/                   # Container (wires hook + component)
└── components/
    └── hello-form/              # Presentational (UI only)
```

## 1. SocketProvider (Context)

Wraps the app at the root layout level. Manages the single Socket.io connection.

**File:** `src/contexts/socket-context.tsx`

```typescript
"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";

export type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
  emit: (event: string, data?: unknown) => void;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  on: () => {},
  off: () => {},
  emit: () => {},
});
```

## 2. useSocket Hook

Consumer hook that reads from the SocketContext.

**File:** `src/hooks/use-socket/use-socket.ts`

```typescript
"use client";

import { useContext } from "react";
import { SocketContext, SocketContextType } from "@/contexts/socket-context";

export default function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  return context;
}
```

## 3. Usage Pattern

### In any client component:

```typescript
"use client";

import { useEffect } from "react";
import useSocket from "@/hooks/use-socket";

export default function MyComponent() {
  const { connected, on, off, emit } = useSocket();

  useEffect(() => {
    const handleMessage = (data: { text: string }) => {
      console.log("Received:", data.text);
    };

    on("message", handleMessage);

    return () => {
      off("message", handleMessage);
    };
  }, [on, off]);

  const sendMessage = () => {
    emit("message", { text: "Hello server!" });
  };

  return <button onClick={sendMessage}>Send</button>;
}
```

## 4. Event Patterns

### Request-Response (Client emits, server responds)

```typescript
// Client sends 'hello' event
emit("hello", { name: "World" });

// Server responds with 'hello-response' event
useEffect(() => {
  const handleResponse = (data: { message: string }) => {
    console.log(data.message); // "Hello World!"
  };

  on("hello-response", handleResponse);
  return () => off("hello-response", handleResponse);
}, [on, off]);
```

### Listening to Server Pushes

```typescript
useEffect(() => {
  const handleNotification = (data: { title: string; body: string }) => {
    toast(data.title, { description: data.body });
  };

  on("notification", handleNotification);
  return () => off("notification", handleNotification);
}, [on, off]);
```

### Emitting to Specific Rooms

```typescript
// Join a room
emit("join-room", "chat-room-1");

// Send message to the room
emit("room-message", { room: "chat-room-1", message: "Hello everyone!" });
```

## 5. Configuration

The socket URL is configured via `NEXT_PUBLIC_SOCKET_URL` env var:

```bash
# .env.local
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

Default: `http://localhost:301` if not set.

## 6. Container/Presentational Pattern

Follow the existing codebase pattern for socket features:

### Container (`containers/[feature]/[feature]-container.tsx`)

```typescript
"use client";

import useFeature from "@/hooks/use-feature";
import FeatureComponent from "@/components/feature-component";

export default function FeatureContainer() {
  const { data, loading, send } = useFeature();

  return <FeatureComponent data={data} loading={loading} onSend={send} />;
}
```

### Hook (`hooks/use-feature/use-feature.ts`)

```typescript
"use client";

import { useCallback, useEffect, useImmer } from "use-immer";
import useSocket from "@/hooks/use-socket";

type FeatureState = {
  data: string | null;
  loading: boolean;
};

export default function useFeature() {
  const { on, off, emit } = useSocket();
  const [state, setState] = useImmer<FeatureState>({
    data: null,
    loading: false,
  });

  useEffect(() => {
    const handleResponse = (data: { result: string }) => {
      setState((draft) => {
        draft.data = data.result;
        draft.loading = false;
      });
    };

    on("feature-response", handleResponse);
    return () => off("feature-response", handleResponse);
  }, [on, off, setState]);

  const send = useCallback(() => {
    setState((draft) => {
      draft.loading = true;
    });
    emit("feature", { timestamp: Date.now() });
  }, [emit, setState]);

  return { ...state, send };
}
```

### Presentational (`components/feature-component/`)

- Pure UI component with typed props
- No socket logic — receives data via props
- Follow existing patterns: `Button`, `Input`, `Card` from UI primitives

## 7. Root Layout Integration

The `SocketProvider` wraps the app in `app/layout.tsx`:

```typescript
import { SocketProvider } from "@/contexts/socket-context";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <main>{children}</main>
        </SocketProvider>
      </body>
    </html>
  );
}
```

## Anti-patterns

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| Create socket connection in each component | Use SocketProvider — single connection shared |
| Forget to clean up `on` listeners | Always `off` in useEffect cleanup |
| Use socket for CRUD operations | Use REST/ky for CRUD; socket for real-time only |
| Emit without checking `connected` state | Check `connected` before emitting |
| Put business logic in presentational components | Keep socket logic in hooks, pass data via props |

## Verification

```bash
# TypeScript check
cd apps/frontend && npx tsc --noEmit

# Start both servers
# Terminal 1: cd apps/backend && npm run dev
# Terminal 2: cd apps/frontend && pnpm dev

# Navigate to http://localhost:3000/example/hello
# Type a name, click "Send Hello"
# Should see "Hello {name}!" response
```
