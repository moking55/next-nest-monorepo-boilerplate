---
name: create-frontend-page
description: Create a full frontend page structure following the 4-layer architecture (Page -> Container -> Component). Includes steps for server components, containers using useImmer, optional components, and hooks.
author: Antigravity
---

# Create Frontend Page

Follow these steps to create a new frontend page in the application.

## 1. Create Page (Server Component)

- Create a `page.tsx` inside a module folder within `app/(screens)/`.
- This file must be a **Server Component** (use `import 'server-only'` if needed, or just default server component behavior in App Router).
- It should import and render the Container.

```tsx
// app/(screens)/[module]/page.tsx
import Container from "@/containers/[module]";

export default function Page() {
  return <Container />;
}
```

## 2. Create Container

- Create a folder inside `src/containers/[module]/`.
- The container should be **single purpose**.
- It must follow the 3-4 file structure:

### File Structure

- `[module].tsx` (The main logic and view, e.g., `login.tsx`)
- `types.ts` (Define props and state types)
- `index.ts` (Export the container and types)
- `helper.ts` (Optional, internal helpers)

### Rules for Container

- **State Management**: Use `useImmer` instead of `useState`.
- **Exports**:
  - `index.ts` should export the default component and types.
  - `helper.ts` should NOT export `*`. Only export specific types/functions used within the folder.

### Example: definition of types.ts

```typescript
// src/containers/[module]/types.ts
export type [Module]ContainerProps = Record<string, never>;

export type [Module]State = {
  // state properties
};
```

### Example: definition of index.ts

```typescript
// src/containers/[module]/index.ts
export { default } from "./[module]";
export type { [Module]ContainerProps } from "./types";
```

### Example: useImmer usage

```tsx
import { useImmer } from "use-immer";

// ... inside component
const [person, updatePerson] = useImmer({
  name: "Michel",
  age: 33,
});

function updateName(name) {
  updatePerson((draft) => {
    draft.name = name;
  });
}
```

## 3. Create Components (Optional)

- Create components inside `src/components/...` if needed.
- Each component should be **single purpose**.
- Follow the same 3-4 file structure if the component is complex (`[component].tsx`, `types.ts`, `index.ts`, `styles.module.css`).

## 4. Bind Hooks (Optional)

- Create custom hooks if needed.
- Place in `src/hooks/[hook-name]/`.
- Follow the 3-4 file structure:
  - `[hook-name].ts`
  - `types.ts`
  - `index.ts`

## Summary of Rules

1. **Structure**: 3-4 files per folder (`[name].tsx`, `types.ts`, `index.ts`, optional `helper.ts`).
2. **Component Definition**: Always use named functions (`function ComponentName() {}`) for components, never arrow functions.
3. **State**: Always use `useImmer`.
4. **Exports**: Be explicit. Do not use `export *` for helpers.
