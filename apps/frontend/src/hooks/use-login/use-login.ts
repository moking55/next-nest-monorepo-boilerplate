"use client";

import { useState, useCallback } from "react";
import { useImmer } from "use-immer";
import { useRouter } from "next/navigation";
import { LoginState } from "./types";
import { loginAction } from "./actions";

export default function useLogin() {
  const router = useRouter();
  const [state, setState] = useImmer<LoginState>({
    username: "",
    password: "",
    error: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFieldChange = useCallback(
    (field: keyof LoginState, value: string) => {
      setState((draft) => {
        (draft as unknown as LoginState)[field] = value;
        draft.error = null;
      });
    },
    [setState],
  );

  const login = useCallback(async () => {
    if (!state.username || !state.password) {
      setState((draft) => {
        draft.error = "Please enter both username and password";
      });
      return;
    }

    setLoading(true);
    setState((draft) => {
      draft.error = null;
    });

    try {
      const result = await loginAction({
        username: state.username,
        password: state.password,
      });

      if (result.success) {
        // Read callbackUrl from current URL search params
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl");

        // Redirect to callbackUrl if present, otherwise to product page
        router.push(callbackUrl || "/product");
      } else {
        setState((draft) => {
          draft.error = result.error || "Invalid credentials";
        });
      }
    } catch {
      setState((draft) => {
        draft.error = "Connection error occurred";
      });
    } finally {
      setLoading(false);
    }
  }, [state.username, state.password, setState, router]);

  return {
    error: state.error,
    loading,
    login,
    onFieldChange: handleFieldChange,
    password: state.password,
    username: state.username,
  };
}
