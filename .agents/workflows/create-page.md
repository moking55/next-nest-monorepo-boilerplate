---
description: Create frontend page structure
---

# Create a New Page

Follow these steps to create a new page in any frontend app using the 4-layer architecture (Layout → Screen → Container → Component).

> **Important**: Before creating a page, examine existing pages and containers in the target app to match the project's patterns (routing structure, styling approach, i18n setup, etc.).

## Step 1: Identify Project Patterns

Check existing structure in the target app:

- `apps/[app-name]/app/` - for routing structure (e.g., `(screens)`, `[locale]/(screen)`)
- `apps/[app-name]/src/containers/` - for container patterns
- Look for styling patterns: Tailwind classes, CSS modules (`.module.css`), or UI library

## Step 2: Create Page (Screen Layer)

**Location:** `apps/[app-name]/app/[routing-structure]/[page-name]/page.tsx`

The routing structure varies by app:

- `frontend`: `app/(screens)/(authenticated)/[page-name]/`
- `frontend-line`: `app/[locale]/(screen)/(authenticated)/[page-name]/`

```tsx
import "server-only";
import [ContainerName]Container from "@/containers/[container-name]";

export default async function Page() {
  return <[ContainerName]Container />;
}
```

**Rules:**

- Use **kebab-case** for page folder name
- Import `"server-only"` at the top
- Keep as Server Component - only import and render the container

## Step 3: Create Container Folder

**Location:** `apps/[app-name]/src/containers/[container-name]/`

Create folder structure:

```
src/containers/[container-name]/
├── [container-name].tsx        # Main container
├── [container-name].module.css # Optional: CSS module styles
├── types.ts                    # Type definitions
└── index.ts                    # Barrel exports
```

## Step 4: Create types.ts

```typescript
export type [ContainerName]ContainerProps = {
  title?: string;
};

export type [ContainerName]State = {
  isLoading: boolean;
};
```

**Rules:**

- Use `export type` (not `interface`)
- Use **PascalCase** for type names

## Step 5: Create Container Component

**Pattern A: With CSS Modules**

```tsx
"use client";

import { useImmer } from "use-immer";
import clsx from "clsx";
import styles from "./[container-name].module.css";

export default function [ContainerName]Container() {
  const [state, setState] = useImmer({
    // state here
  });

  return (
    <div className={clsx(styles.container)}>
      {/* Container content */}
    </div>
  );
}
```

**Pattern B: With Tailwind CSS**

```tsx
"use client";

import { useImmer } from "use-immer";
import clsx from "clsx";

export default function [ContainerName]Container() {
  const [state, setState] = useImmer({
    // state here
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Container content */}
    </div>
  );
}
```

**Rules:**

- Use `"use client"` only when needed (hooks, state, events)
- Use `useImmer` for complex state management
- Use `clsx` to merge class names

## Step 6: Create Styles (if needed)

Only create if the app uses CSS modules:

```css
/* [container-name].module.css */
.container {
  padding: 2rem;
}
```

## Step 7: Create index.ts

```typescript
export { default } from "./[container-name]";
export type { [ContainerName]ContainerProps } from "./types";
```

**Important:** Use `export type { }` for type exports.

## Naming Conventions

| Element          | Convention | Example                       |
| ---------------- | ---------- | ----------------------------- |
| Page folder      | kebab-case | `leave-requests`              |
| Page file        | `page.tsx` | `page.tsx`                    |
| Container folder | kebab-case | `leave-requests`              |
| Container file   | kebab-case | `leave-requests.tsx`          |
| Module CSS file  | kebab-case | `leave-requests.module.css`   |
| Component name   | PascalCase | `LeaveRequestsContainer`      |
| Type names       | PascalCase | `LeaveRequestsContainerProps` |
| CSS class names  | camelCase  | `.container`, `.loadingState` |

## Success Criteria

- ✅ Page created in correct routing structure
- ✅ Page uses `"server-only"` import
- ✅ Container folder has required files (`tsx`, `types.ts`, `index.ts`)
- ✅ CSS module only created if project uses CSS modules
- ✅ Types use `export type` syntax
- ✅ `"use client"` only added when necessary
- ✅ Naming conventions are consistent
