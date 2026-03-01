import { User } from "./User";

export interface UserPort {
  getUserByEmail(email: string): Promise<User | null>;
}
