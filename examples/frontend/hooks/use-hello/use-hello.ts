"use client";

import { useCallback, useEffect } from "react";
import { useImmer } from "use-immer";
import useSocket from "@/hooks/use-socket";

type HelloState = {
  name: string;
  response: string | null;
  error: string | null;
};

export default function useHello() {
  const { connected, on, off, emit } = useSocket();
  const [state, setState] = useImmer<HelloState>({
    name: "",
    response: null,
    error: null,
  });

  useEffect(() => {
    const handleHelloResponse = (...args: unknown[]) => {
      const data = args[0] as { message: string };
      setState((draft) => {
        draft.response = data.message;
        draft.error = null;
      });
    };

    on("hello-response", handleHelloResponse);

    return () => {
      off("hello-response", handleHelloResponse);
    };
  }, [on, off, setState]);

  const sendHello = useCallback(() => {
    if (!state.name.trim()) {
      setState((draft) => {
        draft.error = "Please enter a name";
      });
      return;
    }

    setState((draft) => {
      draft.error = null;
      draft.response = null;
    });

    emit("hello", { name: state.name });
  }, [state.name, emit, setState]);

  const onNameChange = useCallback(
    (value: string) => {
      setState((draft) => {
        draft.name = value;
        draft.error = null;
      });
    },
    [setState],
  );

  return {
    connected,
    error: state.error,
    name: state.name,
    response: state.response,
    sendHello,
    onNameChange,
  };
}
