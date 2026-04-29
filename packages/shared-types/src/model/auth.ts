import { Users } from "./users";

export type LoginRequest = {
  username?: string;
  password?: string;
};

export type AuthResponse = {
  token: string;
  user: Users;
};
