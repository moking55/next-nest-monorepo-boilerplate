---
name: backend-socket-usage
description: Add Socket.io WebSocket support to NestJS backend modules. Covers gateway setup, event handling, rooms, broadcasting, and JWT authentication.
author: Antigravity
---

# Socket.io Backend Skill

This skill covers adding real-time WebSocket communication to `apps/backend` modules using Socket.io with NestJS WebSockets.

## 1. Module Structure

Each socket feature lives at `apps/backend/src/modules/socket/` (or can be scoped per feature module).

```
socket/
├── socket.module.ts          # Module registration
├── socket.gateway.ts         # WebSocket gateway with event handlers
└── socket.service.ts         # Business logic for socket operations
```

## 2. Gateway (`socket.gateway.ts`)

The gateway is the core WebSocket handler. It defines which events the server listens to and how to respond.

```typescript
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('hello')
  handleHello(@MessageBody() data: { name: string }, client: Socket) {
    this.logger.log(`Received hello from ${client.id}: ${data?.name}`);
    const response = { event: 'hello-response', data: { message: `Hello ${data?.name || 'World'}!` } };
    client.emit('hello-response', response.data);
    return response;
  }
}
```

### Key Decorators

| Decorator | Purpose |
|-----------|---------|
| `@WebSocketGateway(options)` | Marks class as WebSocket gateway. Options: `cors`, `namespace`, `path` |
| `@WebSocketServer()` | Injects the Socket.io `Server` instance |
| `@SubscribeMessage('event')` | Listens for a specific event from clients |
| `@MessageBody()` | Extracts the data payload from the event |

### Gateway Options

```typescript
@WebSocketGateway({
  cors: { origin: '*' },           // CORS configuration
  namespace: '/chat',              // Optional namespace
  path: '/socket.io',              // Custom path (default is /socket.io)
})
```

## 3. Service (`socket.service.ts`)

The service provides methods for emitting events from outside the gateway (e.g., from other services or controllers).

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  broadcast(event: string, data: unknown) {
    if (this.server) {
      this.server.emit(event, data);
      this.logger.log(`Broadcasted ${event}`);
    }
  }

  sendToClient(clientId: string, event: string, data: unknown) {
    if (this.server) {
      this.server.to(clientId).emit(event, data);
    }
  }

  sendToRoom(room: string, event: string, data: unknown) {
    if (this.server) {
      this.server.to(room).emit(event, data);
    }
  }
}
```

## 4. Module (`socket.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway, SocketService],
})
export class SocketModule {}
```

## 5. Register in App Module

Add `SocketModule` to `app.module.ts`:

```typescript
import { SocketModule } from './modules/socket/socket.module';

@Module({
  imports: [
    // ... other modules
    SocketModule,
  ],
})
export class AppModule {}
```

## 6. Event Patterns

### Request-Response (Client emits, server responds)

Client sends `hello` event → Server responds with `hello-response`:

```typescript
// Server handler
@SubscribeMessage('hello')
handleHello(@MessageBody() data: { name: string }, client: Socket) {
  return { event: 'hello-response', data: { message: `Hello ${data?.name}!` } };
}
```

### One-Way Emit (Server pushes to client)

```typescript
// From gateway or service
client.emit('notification', { message: 'New update available' });
```

### Broadcast to All Clients

```typescript
this.server.emit('announcement', { message: 'System maintenance at 5 PM' });
```

## 7. Rooms

Rooms allow grouping clients for targeted broadcasts.

### Joining/Leaving Rooms

```typescript
@SubscribeMessage('join-room')
handleJoinRoom(@MessageBody() room: string, client: Socket) {
  client.join(room);
  this.logger.log(`Client ${client.id} joined room ${room}`);
}

@SubscribeMessage('leave-room')
handleLeaveRoom(@MessageBody() room: string, client: Socket) {
  client.leave(room);
  this.logger.log(`Client ${client.id} left room ${room}`);
}
```

### Sending to a Room

```typescript
@SubscribeMessage('room-message')
handleRoomMessage(@MessageBody() data: { room: string; message: string }, client: Socket) {
  this.server.to(data.room).emit('room-message', {
    sender: client.id,
    message: data.message,
  });
}
```

## 8. Broadcast from Other Services

Use `SocketService` to emit events from any injectable service:

```typescript
import { Injectable } from '@nestjs/common';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class OrderService {
  constructor(private readonly socketService: SocketService) {}

  async createOrder(data: CreateOrderDto) {
    const order = await this.repository.save(data);

    // Broadcast to all connected clients
    this.socketService.broadcast('order-created', {
      orderId: order.id,
      status: order.status,
    });

    return order;
  }
}
```

## 9. JWT Authentication (Optional)

Validate JWT on connection using the `handleConnection` hook:

```typescript
@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection {
  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token as string);
      client.data.user = payload; // Attach user to socket
      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch (error) {
      client.disconnect();
    }
  }
}
```

## 10. Namespace Separation

Isolate features into different namespaces:

```typescript
@WebSocketGateway({ namespace: '/notifications' })
export class NotificationGateway { }

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway { }
```

## Anti-patterns

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| Put business logic in gateway | Extract logic to a service, inject it into gateway |
| Forget CORS configuration | Always set `cors: { origin: '*' }` or specific origins |
| Emit without null checks | Check `if (this.server)` before emitting |
| Store state in gateway directly | Use a service with a Map/Set for connected clients |
| Hardcode event names | Define event constants in a shared file or use enums |

## Verification

```bash
# TypeScript check
cd apps/backend && npx tsc --noEmit

# Start the server
cd apps/backend && npm run dev

# Test with a Socket.io client (e.g., socket.io-client)
# Connect to ws://localhost:3001
# Emit: hello { "name": "Test" }
# Expect: hello-response { "message": "Hello Test!" }
```
