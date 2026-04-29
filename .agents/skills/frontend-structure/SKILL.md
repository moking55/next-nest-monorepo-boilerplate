---
name: frontend-structure
description: 'Review and create frontend page structure in apps/frontend (App Router). Use when: adding a new screen, organizing containers/components/hooks, or checking layout boundaries.'
argument-hint: 'Feature name and whether it is authenticated or public.'
---

# Frontend Structure (apps/frontend)

Use this skill to keep the Next.js App Router structure consistent with the current repo conventions.

## When to Use
- Create a new screen or route under `app/(screens)`
- Add or refactor a container in `src/containers`
- Build presentational components in `src/components`
- Add or reuse hooks in `src/hooks`

## Procedure

### 1. Choose the screen scope
- **Authenticated screen**: `app/(screens)/(authenticated)/[feature]/page.tsx`
- **Public screen**: `app/(screens)/[feature]/page.tsx`
- Reuse layout groups when available (e.g., `app/(screens)/(authenticated)/layout.tsx`).

### 2. Create the page (server component)
Keep `page.tsx` minimal and server-only. It should only render the container.

```tsx
import "server-only";
import FeatureContainer from "@/containers/feature";

export default function FeaturePage() {
  return <FeatureContainer />;
}
```

### 3. Create the container
- **Location**: `src/containers/[feature]/`
- **Files**:
  - `[feature]-container.tsx` (client component if it uses hooks/state)
  - `use-[feature].ts` (required hook for every container)
  - `types.ts` (props/state types)
  - `index.ts` (re-exports)
  - `[feature]-container.module.css` (optional)

```tsx
"use client";

import type { FeatureContainerProps } from "./types";
import useFeature from "./use-feature";

export default function FeatureContainer(_: FeatureContainerProps) {
  const { data, loading, error } = useFeature();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return <div className="p-6">{data.length} items</div>;
}
```

```ts
// src/containers/feature/types.ts
export type FeatureContainerProps = Record<string, never>;
```

```ts
// src/containers/feature/index.ts
export { default } from "./feature-container";
export type { FeatureContainerProps } from "./types";
export type { UseFeatureReturn } from "./types";

// src/containers/feature/use-feature.ts
import { useEffect } from "react";
import { useImmer } from "use-immer";
import type { UseFeatureReturn } from "./types";

export default function useFeature(): UseFeatureReturn {
  const [state, setState] = useImmer({
    data: [] as string[],
    loading: false,
    error: null as string | null,
  });

  useEffect(() => {
    // Fetch data and update state here.
    setState((draft) => {
      draft.loading = false;
    });
  }, [setState]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
  };
}
```

### 4. Create presentational components
- **Location**: `src/components/[component]/`
- **Files**: `[component].tsx`, `types.ts`, `index.ts`, optional `*.module.css`
- Keep UI components presentational and drive behavior via props.

### 5. Create or reuse hooks
- Every container must have a dedicated hook in its container folder (`use-[feature].ts`).
- **Shared hooks** should live in `src/hooks/[hook-name]/`.
- **Shared hook files**: `[hook-name].ts`, `types.ts`, `index.ts`.
- Encapsulate API calls, state, and side effects in hooks.

### 6. Imports and styling
- Use absolute imports via `@/`.
- Use Tailwind utilities for quick styling and CSS modules for layout or complex styling.

## Validation Checklist
- `page.tsx` is server-only and renders only the container.
- Every container has a dedicated `use-[feature].ts` hook.
- Stateful containers use `use-immer` for state.
- Data fetching and effects live in hooks.
- Presentational components stay UI-only.
- `types.ts` uses explicit `export type { ... }` in `index.ts` (no `export *`).
