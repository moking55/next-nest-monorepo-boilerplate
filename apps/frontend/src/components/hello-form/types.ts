export type HelloFormProps = {
  connected: boolean;
  error?: string | null;
  name: string;
  onNameChange: (value: string) => void;
  onSend: () => void;
  response?: string | null;
};
