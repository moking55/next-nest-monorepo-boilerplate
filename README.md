# NestJS + Next.js Monorepo Template

A production-ready monorepo template with **NestJS 11** backend and **Next.js 16** frontend (App Router), sharing types via `packages/shared-types`.

## Quick Start

```bash
# Install dependencies
npm install

# Start both apps
npm run dev:all

# Or start individually
npm run dev:backend    # http://localhost:8000
npm run dev:frontend   # http://localhost:3000
```

## Project Structure

```
├── apps/
│   ├── backend/           # NestJS 11 + TypeORM + PostgreSQL
│   │   └── src/
│   │       ├── common/    # Base classes, filters, utils
│   │       ├── database/  # TypeORM config & migrations
│   │       └── modules/
│   │           └── auth/  # JWT auth (template core)
│   └── frontend/          # Next.js 16 (App Router) + React 19
│       ├── app/           # Routes & layouts
│       └── src/
│           ├── components/  # UI components (shadcn/ui)
│           ├── containers/  # Smart components
│           ├── hooks/       # Shared hooks (useApi, useLogin)
│           └── lib/         # Utilities
├── packages/
│   └── shared-types/     # Shared TypeScript types
├── examples/              # Reference implementations
│   ├── backend/modules/   # Product, Users modules
│   ├── frontend/          # Product page, container, hooks
│   └── shared-types/      # Product, OrderStatus types
└── .agents/               # AI skills, workflows, rules
```

## Template vs Examples

This repo is a **template**. The `apps/` folder contains only core infrastructure:

| Template Core (`apps/`) | Examples (`examples/`) |
|------------------------|----------------------|
| Auth module (JWT login) | Product module (full CRUD) |
| Base classes (Controller, Service, Entity) | Users module (with auth) |
| API proxy (`/api/proxy/[...path]`) | Product page & container |
| Auth middleware (cookie-based) | use-products hook |
| Shared types (UserRole, Auth) | ProductStatus, OrderStatus |

### Using Examples

Copy features from `examples/` into `apps/` when you need them:

```bash
# Copy Product backend module
cp -r examples/backend/modules/product apps/backend/src/modules/

# Copy Product frontend page
cp -r examples/frontend/containers/product apps/frontend/src/containers/
cp examples/frontend/app/\(screens\)/\(authenticated\)/product/page.tsx apps/frontend/app/\(screens\)/\(authenticated\)/product/

# Copy shared types
cp examples/shared-types/src/enums/product-status.ts packages/shared-types/src/enums/
cp examples/shared-types/src/model/product.ts packages/shared-types/src/model/

# Register in app.module.ts and add exports to shared-types/index.ts
```

See `examples/README.md` for detailed instructions.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start both apps concurrently |
| `npm run dev:backend` | Start NestJS backend |
| `npm run dev:frontend` | Start Next.js frontend |
| `npm run build:all` | Build both apps |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run all tests |
| `npm run migrate:run` | Run database migrations |
| `npm run clean:examples` | Remove examples folder |

## Tech Stack

### Backend
- **Framework**: NestJS 11
- **Database**: PostgreSQL + TypeORM
- **Auth**: Passport JWT + bcrypt
- **Docs**: Swagger + Scalar

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS 4
- **State**: use-immer
- **HTTP**: ky (via useApi hook)

### Shared
- **Types**: TypeScript types/enums in `packages/shared-types`
- **Package Manager**: pnpm 9.1.0

## Architecture

### Backend: Module Pattern

Each feature is a self-contained module:

```
modules/[feature]/
├── [feature].controller.ts   # Extends BaseControllerOperations
├── [feature].service.ts      # Extends BaseServiceOperations
├── [feature].module.ts
├── dto/                      # class-validator + Swagger
└── entities/                 # TypeORM entity (extends BaseCustomEntity)
```

### Frontend: 4-Layer Pattern

```
app/(screens)/(authenticated)/[feature]/page.tsx  → Server Component
src/containers/[feature]/                          → Smart Component (hooks, state)
src/hooks/use-[feature]/                           → API hook (useApi + useImmer)
src/components/ui/[component]/                     → Presentational UI
```

### Auth Flow

1. Frontend calls `/api/proxy/auth/login` with credentials
2. Backend validates via Passport Local strategy, returns JWT
3. Frontend stores token in `token` cookie
4. All subsequent requests go through `/api/proxy/[...path]` with Bearer token
5. Middleware checks cookies for auth state and role-based routing

## Environment Variables

### Backend (`apps/backend/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
APP_PORT=8000
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
SESSION_SECRET=your-session-secret
```

### Frontend (`apps/frontend/.env.development`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
```

## License

ISC
