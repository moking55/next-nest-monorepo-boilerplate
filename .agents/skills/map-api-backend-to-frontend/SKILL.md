---
name: map-api-backend-to-fontend
description: Map an API endpoint to the codebase patterns (API function + Hook)
author: Antigravity
---

# Map API Backend to Frontend

Follow this workflow to map a backend API endpoint to the frontend codebase. This workflow assumes a standard Next.js (App Router) structure with a dedicated `hooks` directory.

## Step 1: Analyze Request & Validate Input

1.  **Extract Information**:
    - **Resource Name**: The entity being managed (e.g., `users`, `patients`).
    - **Action**: What is being done? (e.g., `get`, `create`, `update`, `delete`).
    - **HTTP Method**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
    - **API Route**: The endpoint URL (e.g., `/users`, `/v1/patients`).

2.  **Validation Check**:
    - **IF** the **API Route** is NOT provided or cannot be confidently inferred:
      - **STOP**. Do not generate any code.
      - **Action**: Ask the user: "Please provide the API route/endpoint URL."

## Step 2: Define Types

1.  **Shared Types**:
    - Check if the core entity model already exists in `@packages/shared-types` or equivalent.
    - If yes, import it: `import { EntityName } from 'shared-types';`
    - If no, consider creating it there or locally if it's UI-specific.

2.  **Local Types**:
    - **Target File**: `apps/[app-name]/src/hooks/[hook-name]/types.ts`.
    - Define input payloads (e.g., `CreateUserPayload`, `UpdateProfileRequest`) that are specific to this API call.
    - **Naming Convention**: PascalCase.

## Step 3: Implement Hook

1.  **Folder Structure**:
    - Create directory: `apps/[app-name]/src/hooks/[hook-name]/`.
    - Files: `index.ts`, `types.ts`, `[hook-name].ts`.

2.  **Implementation Pattern (`[hook-name].ts`)**:
    - **Imports**:
      - `import { useState, useCallback } from 'react';` (or `useImmer`).
      - `import useApi from '../use-api';` (The `ky` instance wrapper).
      - Import types from `./types` and `shared-types`.
    - **Logic**:
      - Initialize `useApi()`.
      - Set up state: `loading` (boolean), `error` (Error | null), and `data` (if necessary).
      - **Action Function**: Use `useCallback` for the API call.
      - **API Call**:
        - Use `api.get(...)`, `api.post(...)`, `api.put(...)`, etc.
        - Use `.json<ReturnType>()` to type the response.
        - Typical response structure handling: `response.data.attributes` (adjust based on actual backend response envelope).
    - **Return**:
      - Return an object containing the action function, `loading`, `error`, and any data state.

3.  **Example Template**:

    ```typescript
    import { useState, useCallback } from "react";
    import { User } from "shared-types";
    import useApi from "../use-api";
    import { CreateUserPayload } from "./types";

    export default function useCreateUser() {
      const api = useApi();
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);

      const createUser = useCallback(
        async (payload: CreateUserPayload) => {
          setLoading(true);
          setError(null);
          try {
            const res = await api
              .post("users", { json: payload })
              .json<{ data: User }>();
            return res.data;
          } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
            throw err; // Rethrow to let caller handle if needed
          } finally {
            setLoading(false);
          }
        },
        [api],
      );

      return { createUser, loading, error };
    }
    ```

4.  **Export**:
    - In `index.ts`: `export { default } from './[hook-name]';`
    - (Optional) Export types if needed.
