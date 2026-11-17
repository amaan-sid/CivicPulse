export type UserRole = "resident" | "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  flatNumber?: string;
  societyLabel?: string;
  society?: string;
  societyResolved?: boolean;
}
