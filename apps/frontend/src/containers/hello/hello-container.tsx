"use client";

import HelloForm from "@/components/hello-form";
import useHello from "@/hooks/use-hello";

export default function HelloContainer() {
  const { connected, error, name, onNameChange, response, sendHello } =
    useHello();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <HelloForm
        connected={connected}
        error={error}
        name={name}
        onNameChange={onNameChange}
        onSend={sendHello}
        response={response}
      />
    </div>
  );
}
