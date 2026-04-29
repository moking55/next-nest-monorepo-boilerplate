import { UserRole } from "../enums/user-role.enum";

export type Users = {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
};
