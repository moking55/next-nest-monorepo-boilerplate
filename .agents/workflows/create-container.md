---
description: How to create a new container component (Smart Component)
---

# Create Container Workflow

This workflow guides you through creating a new **Container** component. Containers are "smart" components that connect logic (hooks, state, data fetching) to the UI. They are typically page-level or section-level components.

> [!IMPORTANT]
> This workflow strictly adheres to the project's **Format Component** and **Container Structure** guidelines.
> - **Separation of Concerns**: Logic MUST be extracted into a custom hook (`use{Name}`).
> - **Structure**: MUST follow the standard file structure including `index.ts`, component, styles, hook, and types.
> - **Optimization**: Render components MUST be wrapped in `memo`.

---

## Prerequisites

- **Container Name**: kebab-case (e.g., `container-opd-visit-order`, `service-history-container`)
- **Target Package**: (e.g., `core-emr`, `core-examination`)
- **Purpose**: To bundle logic and UI for a specific feature or page section.

---

## Step 1: Create Container Folder

Create the folder at:
```
packages/{package-name}/src/containers/{container-name}/
```

### Required Files Structure:

```
{container-name}/
├── index.ts
├── {container-name}.tsx
├── {container-name}.module.css
├── use-{container-name}.ts  <-- The Logic (Hook)
└── types.ts
```

### 1.1 index.ts

```ts
export { default } from "./{container-name}";
export type { {PascalCaseName}Props } from "./types";
```

### 1.2 types.ts

Define props for the Container and the Hook return type.

```ts
import type { ComponentPropsWithoutRef } from "react";

// 1. Container Props
export interface {PascalCaseName}Props extends ComponentPropsWithoutRef<"div"> {
  // Required
  patientId?: string; // Example
}

// 2. Hook Return Interface (State & Handlers)
export interface Use{PascalCaseName}Return {
    state: {
        isLoading: boolean;
        data: any[];
    };
    handlers: {
        onRefresh: () => void;
    };
}
```

### 1.3 use-{container-name}.ts (The Logic)

Encapsulate all state, effects, and handlers here.

```ts
import { useCallback, useEffect } from "react";
import { useImmer } from "use-immer";
// import useService from ...

import type { {PascalCaseName}Props, Use{PascalCaseName}Return } from "./types";

export default function use{PascalCaseName}(props: {PascalCaseName}Props): Use{PascalCaseName}Return {
  // 1. State
  const [state, setState] = useImmer({
    isLoading: false,
    data: [],
  });

  // 2. Effects
  useEffect(() => {
    // Initial fetch logic
  }, []);

  // 3. Handlers
  const handleRefresh = useCallback(() => {
    // Action
  }, []);

  return {
    state: {
        isLoading: state.isLoading,
        data: state.data,
    },
    handlers: {
        onRefresh: handleRefresh,
    }
  };
}
```

### 1.4 {container-name}.tsx (The View)

Purely presentational. Connects the hook to the UI.

```tsx
"use client";

// 1. External modules
import { memo } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

// 2. Internal modules
import Grid from "@meditech/shared/components/grid";
import Paper from "@meditech/shared/components/paper";
import Text from "@meditech/shared/components/text";
// import ChildComponent from ...

// 3. Local files
import use{PascalCaseName} from "./use-{container-name}";
import styles from "./{container-name}.module.css";

// 4. Type imports
import type { {PascalCaseName}Props } from "./types";

function {PascalCaseName}(props: {PascalCaseName}Props) {
  const { className, id, style } = props;

  // 1. Logic Hook
  const { state, handlers } = use{PascalCaseName}(props);
  const t = useTranslations("{package}.containers.{camelCaseName}");

  return (
    <div className={clsx(styles.root, className)} id={id} style={style}>
        <Paper>
            <Grid container gap={16}>
                <Grid column xs={12}>
                     <div className={styles.header}>
                        <Text weight="semibold" size="lg">{t("title")}</Text>
                     </div>
                </Grid>
                {/* Content */}
                <Grid column xs={12}>
                    {state.isLoading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <Text>Content goes here</Text>
                    )}
                </Grid>
            </Grid>
        </Paper>
    </div>
  );
}

export default memo({PascalCaseName});
```

### 1.5 {container-name}.module.css

```css
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
    margin-bottom: var(--spacing-16);
}
```

---

## checklist

- [ ] **Separation**: Logic moved to `use-{container-name}.ts`?
- [ ] **Structure**: All 5 specific files created?
- [ ] **Naming**: Folder `kebab-case`, Component `PascalCase`, Hook `usePascalCase`?
- [ ] **Exports**: `index.ts` exports default and types?
- [ ] **Memoization**: Component wrapped in `memo`?
