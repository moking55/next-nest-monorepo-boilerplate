---
name: create-backend-entity-with-global-type
description: Create a NestJS TypeORM entity together with its shared/global types in packages/shared-types. Covers when to put types in shared-types vs. keeping them backend-only, with complete code examples.
author: Antigravity
---

# Create Entity with Global Types Skill

This skill covers **two related but distinct layers**:

| Layer                  | Location                                       | Purpose                               |
| ---------------------- | ---------------------------------------------- | ------------------------------------- |
| **Shared Type / Enum** | `packages/shared-types/src/`                   | Consumed by both frontend and backend |
| **Backend Entity**     | `apps/backend/src/modules/[feature]/entities/` | TypeORM database table definition     |

Replace `[feature]` with singular kebab-case (e.g. `product`) and `[Feature]` with PascalCase (e.g. `Product`) throughout.

---

## Decision: Shared vs. Backend-Only

Before writing any code, decide **where each type lives**:

### Put in `packages/shared-types` when:

- The frontend needs to reference the type/enum (e.g., filtering, displaying labels)
- The type is part of the HTTP API contract (response shape)
- Example: `OrderStatus` — the frontend filters orders by status, so it must know the valid values

### Keep in `apps/backend/src/modules/[feature]/enum/` when:

- The enum is only used for database storage / service logic
- The frontend never needs to reference the raw enum key
- Example: `UserRole.ADMIN` — only the backend auth guard checks this

**Rule of thumb**: If the frontend renders a dropdown or badge using the value → shared-types. Otherwise → backend-only.

---

## Part A — Shared Types in `packages/shared-types`

### A1. Shared Enum (Union String Type)

Use a **union string type** (not TypeScript `enum`) in shared-types. Union types work in both frontend and backend without runtime overhead.

**File:** `packages/shared-types/src/enums/[feature]-status.ts`

```typescript
// ✅ Union string type — works everywhere, zero runtime cost
export type [Feature]Status = 'active' | 'inactive' | 'archived';
```

> **Never use `enum` keyword** in shared-types — it compiles differently across module systems and adds runtime boilerplate.

### A2. Shared Interface

Define the data shape that the API returns. Include all base fields that come from `BaseCustomEntity`.

**File:** `packages/shared-types/src/model/[feature].ts`

```typescript
import type { [Feature]Status } from '../enums/[feature]-status';

export interface [Feature] {
  // From BaseCustomEntity (always include these)
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Feature-specific fields
  name: string;
  description: string | null;
  status: [Feature]Status;
}
```

### A3. Export from Index

**File:** `packages/shared-types/src/index.ts` — append:

```typescript
export type { [Feature]Status } from './enums/[feature]-status';
export type { [Feature] } from './model/[feature]';
```

### A4. Frontend Usage

After exporting, the frontend imports like this:

```typescript
// In any frontend file
import type { [Feature], [Feature]Status } from 'shared-types';
```

---

## Part B — Backend Entity

### B1. Backend-Only Enum (Optional)

Only create this if the column values should **not** be shared with the frontend.

**File:** `apps/backend/src/modules/[feature]/enum/[feature]-role.enum.ts`

```typescript
// ✅ TypeScript enum — fine for backend-only use
export enum [Feature]Role {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}
```

### B2. Entity

**File:** `apps/backend/src/modules/[feature]/entities/[feature].entity.ts`

Rules:

- Extend `BaseCustomEntity` — gives `id`, `isActive`, `createdAt`, `updatedAt`, `deletedAt` automatically
- **Implement the shared-type interface** — TypeScript enforces the contract matches
- Use `@Column({ type: 'enum', enum: ... })` for enum columns
- Use `snake_case` in `@Column({ name: '...' })` for DB column names when the TS property is `camelCase`
- **Never re-declare** fields provided by `BaseCustomEntity`

```typescript
import { Column, Entity, Index } from 'typeorm';

import { BaseCustomEntity } from '../../../common/utils/base-entity';

// Import shared type to implement
import type { [Feature] as I[Feature] } from 'shared-types';

// Import shared enum for the column type
import type { [Feature]Status } from 'shared-types';

@Entity('[feature]s')
export class [Feature]Entity extends BaseCustomEntity implements I[Feature] {
  @Column({ length: 255 })
  @Index({ unique: true })
  name: string;

  @Column({ length: 1000, nullable: true, type: 'text' })
  description: string | null;

  // Enum column: use the shared union type string values
  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'archived'] as const,
    default: 'active',
  })
  status: [Feature]Status;

  // Example: backend-only enum column
  // @Column({ type: 'enum', enum: [Feature]Role, default: [Feature]Role.VIEWER })
  // role: [Feature]Role;
}
```

> **Why `enum: ['active', 'inactive', 'archived'] as const`?**
> TypeORM accepts both `enum MyEnum` and `string[]` as the enum list. Since shared-types uses union string types (not TS enums), pass the literal string array directly. TypeORM creates a PostgreSQL `ENUM` type from it.

### B3. Handling Different Column Types

| Data Type       | TypeORM Decorator                                                                     |
| --------------- | ------------------------------------------------------------------------------------- |
| Short string    | `@Column({ length: 255 })`                                                            |
| Long text       | `@Column({ type: 'text' })`                                                           |
| Number          | `@Column({ type: 'int' })` or `@Column({ type: 'decimal', precision: 10, scale: 2 })` |
| Boolean         | `@Column({ type: 'boolean', default: false })`                                        |
| JSON/Object     | `@Column({ type: 'jsonb' })`                                                          |
| Date            | `@Column({ type: 'timestamptz' })`                                                    |
| Nullable        | Add `nullable: true` to any `@Column`                                                 |
| DB name differs | Add `name: 'snake_case_name'` to `@Column`                                            |
| Unique          | `@Index({ unique: true })` above `@Column`                                            |

---

## Complete Example — `Product` Feature

### `packages/shared-types/src/enums/product-status.ts`

```typescript
export type ProductStatus = "available" | "out_of_stock" | "discontinued";
```

### `packages/shared-types/src/model/product.ts`

```typescript
import type { ProductStatus } from "../enums/product-status";

export interface Product {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
}
```

### `packages/shared-types/src/index.ts` (additions)

```typescript
export type { ProductStatus } from "./enums/product-status";
export type { Product } from "./model/product";
```

### `apps/backend/src/modules/products/entities/product.entity.ts`

```typescript
import { Column, Entity, Index } from "typeorm";

import { BaseCustomEntity } from "../../../common/utils/base-entity";

import type { Product as IProduct } from "shared-types";
import type { ProductStatus } from "shared-types";

@Entity("products")
export class ProductEntity extends BaseCustomEntity implements IProduct {
  @Column({ length: 255 })
  @Index({ unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({
    type: "enum",
    enum: ["available", "out_of_stock", "discontinued"] as const,
    default: "available",
  })
  status: ProductStatus;
}
```

---

## Anti-patterns

| ❌ Wrong                                                                        | ✅ Correct                                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Use `enum` keyword in shared-types                                              | Use union string type: `type X = 'a' \| 'b'`                              |
| Re-declare `id`, `createdAt`, etc. in entity                                    | Extend `BaseCustomEntity` — it provides them                              |
| Skip `implements I[Feature]` on entity                                          | Always implement the shared interface so TypeScript enforces the contract |
| Put frontend-visible types only in the backend module                           | Move them to `packages/shared-types`                                      |
| Use `@Column({ type: 'enum', enum: MySharedEnum })` (TS enum from shared-types) | Pass string array: `enum: ['a', 'b'] as const`                            |
| Forget to export from `packages/shared-types/src/index.ts`                      | Always append both enum and interface exports                             |

---

## Verification

```bash
# Check TypeScript is happy with the entity implementing the shared interface
cd apps/backend && npx tsc --noEmit

# Confirm the frontend can import the new type
cd apps/frontend && npx tsc --noEmit
```

After the backend restarts with `synchronize: true`, TypeORM auto-creates the new table. Check PostgreSQL to confirm the `[feature]s` table and its ENUM column exist.
