---
description: Create a new component in any frontend app
---

# Create Component

Follow these steps to create a new UI component in any frontend app.

> **Important**: Before creating a component, examine existing components in the target app to match the project's styling approach (Tailwind CSS, CSS Modules, MUI, etc.).

## Step 1: Identify Project Patterns

Check existing components in the target app:

- `apps/[app-name]/src/components/` - for component structure
- Look for styling patterns: Tailwind classes, CSS modules (`.module.css`), or UI library imports

## Step 2: Create Component Folder

Create folder at `apps/[app-name]/src/components/[component-name]/` using kebab-case.

## Step 3: Create types.ts

Define component props using `export type`:

```typescript
import { ComponentPropsWithoutRef, ReactNode } from "react";

export type ComponentNameProps = ComponentPropsWithoutRef<"div"> & {
  /** JSDoc description for prop */
  propName: string;
  optionalProp?: number;
};
```

**Notes:**

- Extend native element props with `ComponentPropsWithoutRef<"element">` for pure HTML
- Extend library props (e.g., MUI's `ButtonProps`) when wrapping library components

## Step 4: Create Styles (if needed)

**Option A: CSS Modules** (e.g., `frontend-line`)

```css
/* [component-name].module.css */
.container {
  display: flex;
}
```

**Option B: Tailwind CSS** (e.g., `frontend`)

- No separate CSS file needed
- Use utility classes directly in component with `clsx` for merging

## Step 5: Create [component-name].tsx

**Pattern A: With CSS Modules**

```tsx
"use client";

import { memo } from "react";
import clsx from "clsx";
import { ComponentNameProps } from "./types";
import styles from "./[component-name].module.css";

function ComponentName({ propName, className, ...rest }: ComponentNameProps) {
  return (
    <div className={clsx(styles.container, className)} {...rest}>
      {/* Component content */}
    </div>
  );
}

export default memo(ComponentName);
```

**Pattern B: With Tailwind CSS**

```tsx
"use client";

import { memo } from "react";
import clsx from "clsx";
import { ComponentNameProps } from "./types";

function ComponentName({ propName, className, ...rest }: ComponentNameProps) {
  return (
    <div className={clsx("flex items-center gap-2", className)} {...rest}>
      {/* Component content */}
    </div>
  );
}

export default memo(ComponentName);
```

**Key rules:**

- **Component Definition**: Always use named functions (`function ComponentName() {}`) for components. Do not use arrow functions.
- Use `"use client"` directive for client components
- Wrap with `memo()` for performance
- Use `clsx` to merge `className` prop with component styles
- Accept and spread `className` for flexibility

## Step 6: Create index.ts

Export the component and types:

```typescript
export { default } from "./[component-name]";
export type { [ComponentName]Props } from "./types";
```

**Important:** Use `export type { }` for type exports.

## Final Structure

```
src/components/[component-name]/
├── [component-name].tsx        # Main component
├── [component-name].module.css # Optional: CSS module styles
├── types.ts                    # Type definitions
└── index.ts                    # Barrel exports
```

## Usage

```tsx
import ComponentName from "@/components/[component-name]";
import type { ComponentNameProps } from "@/components/[component-name]";
```
