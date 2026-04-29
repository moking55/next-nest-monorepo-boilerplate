---
agent: agent
---

# Create a New Page in Next.js Frontend

## Task Overview
Create a new page following the 4-layer architecture pattern (Layout → Screen → Container → Component) with proper file structure and naming conventions.

## Requirements

### 1. Page Creation (Screen Layer)
**Location:** `apps/frontend/app/(screens)/[page-name]/page.tsx`

- Use **kebab-case** for the page folder name (e.g., `leave-requests`, `user-profile`)
- Import and use `"server-only"` at the top of the file
- The page component should be a Server Component by default
- Import and render the corresponding container component

**Example:**
```tsx
import 'server-only';
import { [ComponentName]Container } from '@/containers/[container-name]';

export default function [PageName]Page() {
  return <[ComponentName]Container />;
}
```

### 2. Container Creation
**Location:** `apps/frontend/src/containers/[container-name]/`

Create the following files in the container folder:

#### 2.1 Folder Structure
```
apps/frontend/src/containers/[container-name]/
├── [container-name].tsx
├── [container-name].module.css
├── types.ts
├── index.ts
```

#### 2.2 Component File: `[container-name].tsx`
- Use **kebab-case** for the filename (e.g., `leave-requests.tsx`)
- Import types from `./types`
- Import styles from the module.css file
- Add `'use client'` directive ONLY if the container needs client-side interactivity (hooks, state, event handlers)
- Otherwise, keep it as a Server Component

**Example (Server Component):**
```tsx
import { [componentName]ContainerProps } from './types';
import styles from './[container-name].module.css';

export function [ComponentName]Container({ title }: [componentName]ContainerProps) {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      {/* Container logic here */}
    </div>
  );
}
```

**Example (Client Component):**
```tsx
'use client';

import { useState } from 'react';
import { [componentName]ContainerProps } from './types';
import styles from './[container-name].module.css';

export function [ComponentName]Container({ title }: [componentName]ContainerProps) {
  const [state, setState] = useState();
  
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      {/* Container logic here */}
    </div>
  );
}
```

#### 2.3 Types File: `types.ts`
- Use `export type` instead of `interface`
- Use **camelCase** for type names
- Follow the naming pattern: `[ComponentName]Props`, `[ComponentName]State`, etc.

**Example:**
```tsx
export type [componentName]ContainerProps = {
  title?: string;
  userId?: string;
  onSubmit?: (data: [data]) => void;
};

export type [data] = {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
};

export type [componentName]State = {
  isLoading: boolean;
  error: string | null;
};
```

#### 2.4 Module CSS File: `[container-name].module.css`
- Use **kebab-case** for the filename
- Define component-scoped styles
- Use camelCase for class names in the CSS file

**Example:**
```css
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 1.5rem;
}

.loadingState {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
```

#### 2.5 Index File: `index.ts`
- Export the default component using named export syntax
- Export all types with `export type`

**Example:**
```tsx
export { [ComponentName]Container as default } from './[container-name]';
export type { 
  [componentName]ContainerProps,
  [data],
  [componentName]State 
} from './types';
```

## Naming Convention Summary

| Element | Convention | Example |
|---------|-----------|---------|
| Page folder | kebab-case | `[page-name]` |
| Page file | `page.tsx` | `page.tsx` |
| Container folder | kebab-case | `[container-name]` |
| Container file | kebab-case | `[container-name].tsx` |
| Module CSS file | kebab-case | `[container-name].module.css` |
| Component name | PascalCase | `[ComponentName]Container` |
| Type names | camelCase | `[componentName]ContainerProps` |
| CSS class names | camelCase | `.container`, `.loadingState` |

## Success Criteria

- ✅ Page is created in the correct `(screens)` directory with kebab-case naming
- ✅ Page uses `"server-only"` import
- ✅ Container folder structure matches requirements
- ✅ All required files are created (`tsx`, `module.css`, `types.ts`, `index.ts`)
- ✅ Types use `export type` syntax and camelCase naming
- ✅ Index file properly exports default and types
- ✅ CSS module is properly imported and used
- ✅ `'use client'` directive is only added when necessary (state/hooks/events)
- ✅ Naming conventions are consistent throughout

## Additional Guidelines

1. **Tailwind First**: Use Tailwind classes for most styling; CSS modules for complex/scoped styles
2. **Server Component by Default**: Keep containers as Server Components unless client-side interactivity is needed
3. **Type Safety**: Import shared types from `shared-types` package when applicable
4. **Accessibility**: Ensure proper semantic HTML and ARIA attributes
5. **Responsive Design**: Consider mobile-first approach with Tailwind breakpoints