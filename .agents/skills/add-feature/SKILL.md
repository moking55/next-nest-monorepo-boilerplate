---
name: add-feature
description: Add a complete feature end-to-end: shared types → entity → migration → backend module → frontend page. Runs migration automatically.
author: Antigravity
---

# Add Feature (Full Stack)

This skill guides you through adding a complete feature from scratch, including running TypeORM migrations. Follow each step in order.

> **Template vs Examples**: New features start in `apps/`. Reference implementations live in `examples/`.

## Prerequisites

- Feature name (e.g., `order`, `category`, `invoice`)
- Database fields and types
- API endpoints needed

---

## Step 1: Design Shared Types

Create types in `packages/shared-types/src/`:

**File:** `packages/shared-types/src/enums/[feature]-status.ts`

```typescript
export type [Feature]Status = 'active' | 'inactive' | 'archived';
```

**File:** `packages/shared-types/src/model/[feature].ts`

```typescript
import type { [Feature]Status } from '../enums/[feature]-status';

export interface [Feature] {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  name: string;
  status: [Feature]Status;
}
```

**Export:** Add to `packages/shared-types/src/index.ts`

```typescript
export type { [Feature]Status } from './enums/[feature]-status';
export type { [Feature] } from './model/[feature]';
```

---

## Step 2: Create Backend Entity

**File:** `apps/backend/src/modules/[feature]/entities/[feature].entity.ts`

```typescript
import { Column, Entity, Index } from 'typeorm';
import { BaseCustomEntity } from '@/common/utils/base-entity';
import type { [Feature] as I[Feature] } from 'shared-types';
import type { [Feature]Status } from 'shared-types';

@Entity('[feature]s')
export class [Feature]Entity extends BaseCustomEntity implements I[Feature] {
  @Column({ length: 255 })
  @Index({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'archived'] as const,
    default: 'active',
  })
  status: [Feature]Status;
}
```

---

## Step 3: Generate & Run Migration

```bash
# Generate migration from entity changes
npm run migrate:generate --workspace=backend

# Run the migration
npm run migrate:run --workspace=backend
```

**Verify:**
- Check the generated SQL in `apps/backend/src/database/migrations/`
- Confirm table created in PostgreSQL

---

## Step 4: Create DTOs

**File:** `apps/backend/src/modules/[feature]/dto/create-[feature].dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class Create[Feature]Dto {
  @ApiProperty({ example: 'Feature Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
```

**File:** `apps/backend/src/modules/[feature]/dto/update-[feature].dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { Create[Feature]Dto } from './create-[feature].dto';

export class Update[Feature]Dto extends PartialType(Create[Feature]Dto) {}
```

---

## Step 5: Create Service

**File:** `apps/backend/src/modules/[feature]/[feature].service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceOperations } from '@/common/utils/base-operation';
import { [Feature]Entity } from './entities/[feature].entity';
import type { Create[Feature]Dto } from './dto/create-[feature].dto';
import type { Update[Feature]Dto } from './dto/update-[feature].dto';

@Injectable()
export class [Feature]Service extends BaseServiceOperations<
  [Feature]Entity,
  Create[Feature]Dto,
  Update[Feature]Dto
> {
  constructor(
    @InjectRepository([Feature]Entity)
    private readonly repository: Repository<[Feature]Entity>,
  ) {
    super('[feature]', repository);
  }
}
```

---

## Step 6: Create Controller

**File:** `apps/backend/src/modules/[feature]/[feature].controller.ts`

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseControllerOperations } from '@/common/utils/base-operation';
import { Create[Feature]Dto } from './dto/create-[feature].dto';
import { Update[Feature]Dto } from './dto/update-[feature].dto';
import { [Feature]Entity } from './entities/[feature].entity';
import { [Feature]Service } from './[feature].service';

@ApiTags('[feature]s')
@Controller('[feature]s')
export class [Feature]Controller extends BaseControllerOperations<
  [Feature]Entity,
  Create[Feature]Dto,
  Update[Feature]Dto,
  [Feature]Service
> {
  constructor(private readonly service: [Feature]Service) {
    super(service, '[feature]');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create [feature]' })
  async create(@Body() dto: Create[Feature]Dto) {
    return super.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all [feature]s' })
  async findAll() {
    return super.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get [feature] by ID' })
  async findOne(@Param('id') id: string) {
    return super.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update [feature]' })
  async update(@Param('id') id: string, @Body() dto: Update[Feature]Dto) {
    return super.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete [feature]' })
  async remove(@Param('id') id: string) {
    return super.remove(id, true);
  }
}
```

---

## Step 7: Create Module

**File:** `apps/backend/src/modules/[feature]/[feature].module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { [Feature]Entity } from './entities/[feature].entity';
import { [Feature]Controller } from './[feature].controller';
import { [Feature]Service } from './[feature].service';

@Module({
  imports: [TypeOrmModule.forFeature([[Feature]Entity])],
  controllers: [[Feature]Controller],
  providers: [[Feature]Service],
  exports: [[Feature]Service],
})
export class [Feature]Module {}
```

---

## Step 8: Register Module

Add to `apps/backend/src/app.module.ts`:

```typescript
import { [Feature]Module } from './modules/[feature]/[feature].module';

@Module({
  imports: [
    // ... existing
    [Feature]Module,
  ],
})
export class AppModule {}
```

---

## Step 9: Create Frontend Hook

**File:** `apps/frontend/src/hooks/use-[feature]/types.ts`

```typescript
export type Use[Feature]State = {
  items: any[];
  loading: boolean;
  error: string | null;
};
```

**File:** `apps/frontend/src/hooks/use-[feature]/use-[feature].ts`

```typescript
"use client";
import { useCallback } from "react";
import { useImmer } from "use-immer";
import useApi from "@/hooks/use-api";
import type { Use[Feature]State } from "./types";

export default function use[Feature]() {
  const api = useApi();
  const [state, setState] = useImmer<Use[Feature]State>({
    items: [],
    loading: false,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    setState((draft) => { draft.loading = true; draft.error = null; });
    try {
      const res = await api.get("[feature]s").json<{ data: any[] }>();
      setState((draft) => { draft.items = res.data; draft.loading = false; });
    } catch (err) {
      setState((draft) => {
        draft.error = err instanceof Error ? err.message : "Failed to fetch";
        draft.loading = false;
      });
    }
  }, [api, setState]);

  return { items: state.items, loading: state.loading, error: state.error, fetchAll };
}
```

**File:** `apps/frontend/src/hooks/use-[feature]/index.ts`

```typescript
export { default } from "./use-[feature]";
```

---

## Step 10: Create Frontend Container

**File:** `apps/frontend/src/containers/[feature]/types.ts`

```typescript
export type [Feature]ContainerProps = Record<string, never>;
```

**File:** `apps/frontend/src/containers/[feature]/[feature]-container.tsx`

```tsx
"use client";
import { useEffect } from "react";
import use[Feature] from "@/hooks/use-[feature]";

export default function [Feature]Container() {
  const { items, loading, error, fetchAll } = use[Feature]();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">[Feature]s</h1>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg">
            <h2 className="font-semibold">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File:** `apps/frontend/src/containers/[feature]/index.ts`

```typescript
export { default } from "./[feature]-container";
export type { [Feature]ContainerProps } from "./types";
```

---

## Step 11: Create Frontend Page

**File:** `apps/frontend/app/(screens)/(authenticated)/[feature]/page.tsx`

```tsx
import "server-only";
import [Feature]Container from "@/containers/[feature]";

export default function [Feature]Page() {
  return <[Feature]Container />;
}
```

---

## Step 12: Update Navigation (Optional)

Add to `apps/frontend/src/components/layout/sidebar/navigation.json`:

```json
{
  "label": "[Feature]",
  "href": "/[feature]",
  "icon": "heroicons:icon-name",
  "requiredRole": ["admin"]
}
```

---

## Verification

```bash
# 1. Verify migration ran
npm run migrate:show --workspace=backend

# 2. Start backend and check Swagger
npm run dev:backend
# Open http://localhost:8000/docs

# 3. Start frontend and test page
npm run dev:frontend
# Navigate to http://localhost:3000/[feature]

# 4. Run TypeScript checks
cd apps/backend && npx tsc --noEmit
cd apps/frontend && npx tsc --noEmit
```

---

## Naming Conventions

| Placeholder | Case | Example |
|-------------|------|---------|
| `[Feature]` | PascalCase | `Order` |
| `[feature]` | camelCase | `order` |
| `[feature]s` | plural | `orders` |
| `[feature]-status` | kebab-case | `order-status` |

---

## File Structure Summary

```
apps/backend/src/modules/[feature]/
├── [feature].controller.ts
├── [feature].service.ts
├── [feature].module.ts
├── dto/
│   ├── create-[feature].dto.ts
│   └── update-[feature].dto.ts
└── entities/
    └── [feature].entity.ts

apps/frontend/
├── app/(screens)/(authenticated)/[feature]/page.tsx
├── src/containers/[feature]/
│   ├── [feature]-container.tsx
│   ├── types.ts
│   └── index.ts
└── src/hooks/use-[feature]/
    ├── use-[feature].ts
    ├── types.ts
    └── index.ts

packages/shared-types/src/
├── enums/[feature]-status.ts
├── model/[feature].ts
└── index.ts (updated)
```
