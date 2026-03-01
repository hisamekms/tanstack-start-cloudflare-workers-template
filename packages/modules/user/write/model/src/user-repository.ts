import type { User } from "./user";

export interface UserRepository {
  findBySub(sub: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
