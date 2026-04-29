export type LoginFormProps = {
  onLogin: () => void;
  onPasswordChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  password: string;
  username: string;
  error?: string | null;
  loading?: boolean;
};
