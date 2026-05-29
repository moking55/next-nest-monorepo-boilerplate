---
description: Add a complete feature with migration (end-to-end)
---

# Add Feature Workflow

This workflow adds a complete feature from entity to frontend, including TypeORM migration.

## Steps

### 1. Shared Types

- Create enum in `packages/shared-types/src/enums/[feature]-status.ts`
- Create interface in `packages/shared-types/src/model/[feature].ts`
- Export from `packages/shared-types/src/index.ts`

### 2. Backend Entity

- Create `apps/backend/src/modules/[feature]/entities/[feature].entity.ts`
- Extend `BaseCustomEntity`, implement shared interface

### 3. Migration

```bash
npm run migrate:generate --workspace=backend
npm run migrate:run --workspace=backend
```

### 4. DTOs, Service, Controller, Module

- Create DTOs with class-validator + Swagger decorators
- Create service extending `BaseServiceOperations`
- Create controller extending `BaseControllerOperations`
- Create module with `TypeOrmModule.forFeature`

### 5. Register Module

- Add to `apps/backend/src/app.module.ts`

### 6. Frontend

- Create hook in `apps/frontend/src/hooks/use-[feature]/`
- Create container in `apps/frontend/src/containers/[feature]/`
- Create page in `apps/frontend/app/(screens)/(authenticated)/[feature]/page.tsx`

### 7. Verify

- Check Swagger at `http://localhost:8000/docs`
- Test frontend page at `http://localhost:3000/[feature]`
- Run `npx tsc --noEmit` in both apps
