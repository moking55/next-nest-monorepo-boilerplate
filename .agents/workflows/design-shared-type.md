---
description: Design and create shared types in packages/shared-types
---

# Design Shared Type

Follow these steps to design and create a new shared type for use across frontend and backend.

## Step 1: Understand Requirements

Gather information from the user:

1. **What entity/concept needs to be modeled?** (e.g., User, Order, LeaveRequest)
2. **What are the key properties?** (required fields, optional fields)
3. **What are the data types?** (string, number, boolean, Date, enum, arrays)
4. **Are there any relationships?** (belongs to, has many, references)
5. **What operations will use this type?** (CRUD, specialized queries)

## Step 2: Investigate Existing Models

Search for potentially related existing types:

1. Check `packages/shared-types/src/model/` for existing interfaces
2. Look for similar or parent entities that could be extended
3. Identify common patterns used in existing types (e.g., base fields like `id`, `createdAt`)

Common patterns to look for:

- `id: string` (UUID) - standard primary key
- `createdAt: Date` / `updatedAt: Date` - timestamps
- `isActive: boolean` / `deletedAt: Date | null` - soft delete
- References to other entities (e.g., `userId: string`, `departmentId: string`)

## Step 3: Design the Model

Create the interface following these guidelines:

**File location**: `packages/shared-types/src/model/{entity-name}.ts`

**Template**:

```typescript
/**
 * Represents a {EntityName} in the system.
 *
 * @description Brief description of what this entity represents
 * and its role in the application.
 */
export interface {EntityName} {
  /** Unique identifier (UUID) */
  id: string;

  // === Core Properties ===
  /** Description of property */
  propertyName: string;

  /** Optional property */
  optionalProperty?: number;

  // === Relationships ===
  /** Reference to related entity */
  relatedEntityId: string;

  /** Nested related entity (for populated queries) */
  relatedEntity?: RelatedEntity;

  // === Timestamps ===
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
```

**Design principles**:

- Use `string` for UUIDs, not `number`
- Use `Date` type for timestamps (not `string`)
- Suffix foreign keys with `Id` (e.g., `userId`, `departmentId`)
- Make populated relations optional with `?` suffix
- Group related properties with comments
- Add JSDoc comments for complex fields

**For enums**, create separately:

```typescript
export enum {EntityName}Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export interface {EntityName} {
  status: {EntityName}Status;
  // ...
}
```

## Step 4: Handle Related Types

If the new type relates to existing types:

**Option A: Reference by ID only** (simple, no nesting):

```typescript
export interface Order {
  customerId: string; // Just the ID reference
}
```

**Option B: Optional populated relation** (for queries that join data):

```typescript
import { Customer } from "./customer";

export interface Order {
  customerId: string;
  customer?: Customer; // Optional: populated on demand
}
```

**Option C: Create DTOs for different use cases**:

```typescript
// Base interface
export interface Order { ... }

// For list views (minimal data)
export interface OrderSummary {
  id: string;
  orderNumber: string;
  total: number;
}

// For detail views (full data with relations)
export interface OrderDetail extends Order {
  customer: Customer;
  items: OrderItem[];
}
```

## Step 5: Export the Type

Add export to `packages/shared-types/src/index.ts`:

```typescript
// In index.ts
export { [Entity Name] } from "./model/{entity-name}";
```

**Or for selective exports**:

```typescript
export type { {EntityName}, {EntityName}Status } from './model/{entity-name}';
```

## Step 6: Verify Integration

// turbo

1. Run `npm run build -w shared-types` to ensure types compile
2. Check that the type is accessible from other packages:
   - Frontend: `import { {EntityName} } from 'shared-types';`
   - Backend: `import { {EntityName} } from 'shared-types';`

## Examples

### Simple Entity

```typescript
// packages/shared-types/src/model/department.ts
export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Entity with Enum and Relations

```typescript
// packages/shared-types/src/model/leave-request.ts
export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum LeaveType {
  ANNUAL = "ANNUAL",
  SICK = "SICK",
  PERSONAL = "PERSONAL",
}

export interface LeaveRequest {
  id: string;

  // Core
  type: LeaveType;
  status: LeaveStatus;
  startDate: Date;
  endDate: Date;
  reason: string;

  // Relations
  employeeId: string;
  employee?: Employee;
  approverId?: string;
  approver?: Employee;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

## Checklist

- [ ] User requirements understood
- [ ] Existing related models identified
- [ ] Interface designed with proper types
- [ ] JSDoc comments added for complex fields
- [ ] Related types properly imported/referenced
- [ ] Exported in `index.ts`
- [ ] Build verified
