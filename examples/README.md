# Examples

Reference implementations for the monorepo template. These are **not** part of the template core — they demonstrate how to build features using the template's patterns.

## How to Use

### Copy a feature into the template

1. **Backend module** — copy from `examples/backend/modules/[feature]/` to `apps/backend/src/modules/[feature]/`
2. **Frontend page** — copy from `examples/frontend/` into `apps/frontend/` following the same directory structure
3. **Shared types** — copy from `examples/shared-types/src/` into `packages/shared-types/src/`
4. **Register the module** — add the module to `apps/backend/src/app.module.ts` imports

### Example: Adding the Product feature

```bash
# 1. Copy backend module
cp -r examples/backend/modules/product apps/backend/src/modules/

# 2. Copy frontend page + container + hook
cp examples/frontend/app/\(screens\)/\(authenticated\)/product/page.tsx apps/frontend/app/\(screens\)/\(authenticated\)/product/
cp -r examples/frontend/containers/product apps/frontend/src/containers/
cp -r examples/frontend/hooks/use-products apps/frontend/src/hooks/

# 3. Copy shared types
cp examples/shared-types/src/enums/product-status.ts packages/shared-types/src/enums/
cp examples/shared-types/src/model/product.ts packages/shared-types/src/model/

# 4. Update packages/shared-types/src/index.ts — add exports
# 5. Update apps/backend/src/app.module.ts — register ProductModule
```

## What's Included

| Example | Description |
|---------|-------------|
| `backend/modules/product` | Full CRUD NestJS module with TypeORM entity, DTOs, Swagger docs |
| `backend/modules/users` | User management with auth integration, bcrypt password hashing |
| `frontend/containers/product` | Product listing page with useImmer state management |
| `frontend/hooks/use-products` | API hook using `useApi` + `ky` for product fetching |
| `shared-types/` | Product and OrderStatus types shared between frontend/backend |

## Template Core (not in examples)

These are always included in the template:

- **Auth module** — JWT login, Passport strategies, guards
- **Base classes** — `BaseControllerOperations`, `BaseServiceOperations`, `BaseCustomEntity`
- **API proxy** — `/api/proxy/[...path]` catch-all route
- **Auth middleware** — cookie-based role routing
- **Shared types** — `UserRole`, `Users`, `AuthResponse`, `LoginRequest`
