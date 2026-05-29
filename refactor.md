# Refactor Plan: Monorepo Template

## Goal

Turn this `nestjs-nextjs-monorepo` into a **reusable template** that can be cloned as a starting point for new projects. The current business features (Product, Users) should be moved to an `examples/` folder as reference implementations, while keeping the base infrastructure clean and ready for new projects.

---

## Current State

```
apps/
├── frontend/
│   ├── app/(screens)/
│   │   ├── (authenticated)/
│   │   │   └── product/          ← business feature
│   │   └── login/                ← business feature
│   └── src/
│       ├── components/login-form/ ← business feature
│       ├── containers/login/      ← business feature
│       ├── containers/product/    ← business feature
│       ├── hooks/use-login/       ← business feature
│       └── hooks/use-products/    ← business feature
├── backend/
│   └── src/modules/
│       ├── auth/                  ← base infrastructure (KEEP)
│       ├── product/               ← business feature
│       └── users/                 ← business feature
└── packages/
    └── shared-types/
        └── src/
            ├── enums/             ← mixed (UserRole=base, ProductStatus/OrderStatus=example)
            └── model/             ← mixed (Users/Auth=base, Product=example)
```

---

## Target State

```
├── apps/
│   ├── frontend/
│   │   ├── app/(screens)/
│   │   │   ├── (authenticated)/
│   │   │   │   └── layout.tsx           ← keep (sidebar + header shell)
│   │   │   └── login/
│   │   │       └── page.tsx             ← keep (auth is infrastructure)
│   │   └── src/
│   │       ├── components/login-form/   ← keep
│   │       ├── components/layout/       ← keep (sidebar, header)
│   │       ├── components/ui/           ← keep (shadcn/ui components)
│   │       ├── containers/login/        ← keep
│   │       ├── contexts/socket-context.tsx ← keep (socket infrastructure)
│   │       ├── hooks/use-login/         ← keep
│   │       ├── hooks/use-api/           ← keep (core infrastructure)
│   │       └── hooks/use-socket/        ← keep (socket infrastructure)
│   ├── backend/
│   │   └── src/modules/
│   │       ├── auth/                    ← keep (core infrastructure)
│   │       └── socket/                  ← keep (socket infrastructure)
│   └── packages/
│       └── shared-types/
│           └── src/
│               ├── enums/user-role.ts   ← keep
│               └── model/auth.ts        ← keep
│               └── model/users.ts       ← keep
│
├── examples/                             ← NEW: reference implementations
│   ├── README.md                         ← explains how to use examples
│   ├── backend/
│   │   └── modules/
│   │       ├── product/                  ← moved from apps/backend
│   │       │   ├── product.controller.ts
│   │       │   ├── product.service.ts
│   │       │   ├── product.module.ts
│   │       │   ├── dto/
│   │       │   └── entities/
│   │       └── users/                    ← moved from apps/backend
│   │           ├── users.controller.ts
│   │           ├── users.service.ts
│   │           ├── users.module.ts
│   │           ├── dto/
│   │           └── entities/
│   ├── frontend/
│   │   ├── app/(screens)/(authenticated)/
│   │   │   ├── product/page.tsx
│   │   │   ├── hello/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── settings/general/page.tsx
│   │   ├── components/
│   │   │   └── hello-form/
│   │   ├── containers/
│   │   │   ├── product/
│   │   │   │   ├── product-container.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── hello/
│   │   │       └── hello-container.tsx
│   │   └── hooks/
│   │       ├── use-products/
│   │       │   ├── use-products.ts
│   │       │   ├── types.ts
│   │       │   └── index.ts
│   │       └── use-hello/
│   │           ├── use-hello.ts
│   │           └── index.ts
│   └── shared-types/
│       └── src/
│           ├── enums/
│           │   ├── product-status.ts
│           │   └── order-status.ts
│           └── model/
│               └── product.ts
```

---

## Phase 1: Create `examples/` Structure

### Step 1.1 — Create example directories

```
mkdir -p examples/backend/modules/product
mkdir -p examples/backend/modules/users
mkdir -p examples/frontend/app/\(screens\)/\(authenticated\)/product
mkdir -p examples/frontend/containers/product
mkdir -p examples/frontend/hooks/use-products
mkdir -p examples/shared-types/src/enums
mkdir -p examples/shared-types/src/model
```

### Step 1.2 — Create `examples/README.md`

Explain:
- What the examples folder is for
- How to copy an example into the real `apps/` structure
- How to register modules in `app.module.ts`
- How to add shared types to `packages/shared-types`

---

## Phase 2: Move Backend Examples

### Step 2.1 — Move Product module

| From | To |
|------|-----|
| `apps/backend/src/modules/product/**` | `examples/backend/modules/product/**` |

Files to move:
- `product.controller.ts`
- `product.service.ts`
- `product.module.ts`
- `dto/create-product.dto.ts`
- `dto/update-product.dto.ts`
- `entities/product.entity.ts`

### Step 2.2 — Move Users module

| From | To |
|------|-----|
| `apps/backend/src/modules/users/**` | `examples/backend/modules/users/**` |

Files to move:
- `users.controller.ts`
- `users.service.ts`
- `users.module.ts`
- `dto/create-user.dto.ts`
- `dto/update-user.dto.ts`
- `entities/user.entity.ts`
- `enum/` (if exists)
- `interfaces/` (if exists)

### Step 2.3 — Update `apps/backend/src/app.module.ts`

Remove imports of `ProductModule` and `UsersModule`. Keep only:
- `ConfigModule`
- `ScheduleModule`
- `DatabaseModule`
- `AuthModule`

### Step 2.4 — Update `apps/backend/src/modules/auth/`

Auth module depends on UsersService. Two options:
- **Option A**: Keep a minimal `UsersService` in `apps/backend` for auth (just find-by-username)
- **Option B**: Inline the user lookup directly in `AuthService` using the repository

**Recommended**: Option B — inline user lookup in `AuthService` to remove the Users dependency from the base template.

---

## Phase 3: Move Frontend Examples

### Step 3.1 — Move Product page/container/hook

| From | To |
|------|-----|
| `apps/frontend/app/(screens)/(authenticated)/product/**` | `examples/frontend/app/(screens)/(authenticated)/product/**` |
| `apps/frontend/src/containers/product/**` | `examples/frontend/containers/product/**` |
| `apps/frontend/src/hooks/use-products/**` | `examples/frontend/hooks/use-products/**` |

### Step 3.2 — Keep Login infrastructure

Login is auth infrastructure — keep in `apps/frontend`:
- `app/(screens)/login/page.tsx`
- `src/containers/login/`
- `src/components/login-form/`
- `src/hooks/use-login/`

### Step 3.3 — Clean up authenticated layout

Update `app/(screens)/(authenticated)/layout.tsx` sidebar navigation to remove Product-specific links. Keep the shell (sidebar + header) as a template.

---

## Phase 4: Move Shared Types

### Step 4.1 — Move example types

| From | To |
|------|-----|
| `packages/shared-types/src/enums/product-status.ts` | `examples/shared-types/src/enums/product-status.ts` |
| `packages/shared-types/src/enums/order-status.ts` | `examples/shared-types/src/enums/order-status.ts` |
| `packages/shared-types/src/model/product.ts` | `examples/shared-types/src/model/product.ts` |

### Step 4.2 — Update `packages/shared-types/src/index.ts`

Remove exports of:
- `ProductStatus`
- `OrderStatus`
- `Product`

Keep exports of:
- `UserRole`
- `LoginRequest`, `AuthResponse`
- `Users`

### Step 4.3 — Update `examples/shared-types/src/index.ts`

Create a separate index file that exports the example types, so consumers can reference it.

---

## Phase 5: Update Skills & Workflows

### Step 5.1 — Update `backend-structure` skill

Add note about template vs example:
- Auth module is part of the template core
- Other modules should be created in `examples/backend/modules/` first, then moved to `apps/backend/src/modules/` when confirmed needed

### Step 5.2 — Update `create-backend-entity-with-global-type` skill

Update the shared-types path guidance:
- Template types (auth, users) → `packages/shared-types/src/`
- Feature types → create in `examples/shared-types/src/` first

### Step 5.3 — Update `frontend-structure` skill

Add guidance:
- Login/auth pages are template infrastructure
- Feature pages should follow the example pattern in `examples/frontend/`

### Step 5.4 — Update `create-frontend-page` skill

Add note: when creating a new page, reference `examples/frontend/` for the full pattern.

### Step 5.5 — Update `define-frontend-container` skill

No structural changes needed — the pattern remains the same. Add reference to examples.

### Step 5.6 — Update `map-api-backend-to-frontend` skill

Add note about where to find example mappings in `examples/`.

### Step 5.7 — Update workflows

Update all 6 workflows to reference `examples/` as the source of truth for full working implementations.

### Step 5.8 — Update rules

Update `frontend-instructions.md` and `backend-instructions.md` to mention the template vs example distinction.

---

## Phase 6: Update Configuration Files

### Step 6.1 — Update root `package.json`

- Add script: `"clean:examples": "rm -rf examples"` (for projects that don't want examples)
- Document in README

### Step 6.2 — Update `.gitignore`

No changes needed — examples should be committed.

### Step 6.3 — Update Dockerfiles

Remove any references to example-specific modules. The Dockerfiles should build clean without examples.

### Step 6.4 — Update `.github/copilot-instructions.md`

Add section about template structure and examples folder.

### Step 6.5 — Update `.github/prompts/`

Update prompts to reference examples.

---

## Phase 7: Create Template README

### Step 7.1 — Update root `README.md`

Structure:
1. **Quick Start** — clone, install, run
2. **Project Structure** — explain template vs examples
3. **Template Core** — what's included out of the box (auth, proxy, base classes)
4. **Examples** — how to use examples as reference
5. **Creating New Features** — step-by-step with skill references
6. **Scripts** — all available commands

---

## Execution Order

| # | Phase | Dependencies | Estimated Effort |
|---|-------|-------------|-----------------|
| 1 | Create `examples/` structure | None | Small |
| 2 | Move backend examples | Phase 1 | Medium |
| 3 | Move frontend examples | Phase 1 | Medium |
| 4 | Move shared types | Phase 1 | Small |
| 5 | Update skills & workflows | Phases 2-4 | Medium |
| 6 | Update config files | Phases 2-4 | Small |
| 7 | Update README | All above | Small |

---

## Verification Checklist

After refactoring:

- [x] `npm run dev:all` starts without errors
- [x] Login flow works end-to-end
- [x] Authenticated layout renders (sidebar + header)
- [x] No broken imports in `apps/frontend` or `apps/backend`
- [x] No references to Product/Users in `apps/` (only in `examples/`)
- [x] `packages/shared-types` compiles without Product/Users types
- [x] All skills reference `examples/` correctly
- [x] Dockerfiles build without examples
- [x] `examples/README.md` explains how to copy features back
- [x] No example files left in `apps/` (hello, hello-form, use-hello removed)
- [x] SocketModule incorporated as template infrastructure
- [x] Merge with origin/main completed successfully

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Auth module depends on UsersService | High | Inline user lookup in AuthService (Option B) |
| Frontend middleware references product routes | Medium | Update middleware to only handle login/auth routes |
| Shared types imported by both template and examples | Low | Keep separate index files; examples have their own exports |
| Skills become stale after move | Medium | Update all skills in Phase 5 before merging |
