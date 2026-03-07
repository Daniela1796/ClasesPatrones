import { User } from "../Entities/User";

export interface UserPort {
  getUserByEmail(email: string): Promise<User | null>;
}
