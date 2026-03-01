import type { User, UserRepository } from "@modules/user-write-model";
import { usersTable, type AppDatabase } from "@platform/db-d1";
import { eq } from "drizzle-orm";

function mapRecordToUser(record: typeof usersTable.$inferSelect): User {
  return {
    id: record.id,
    sub: record.sub,
    email: record.email,
    version: record.version,
  };
}

export class D1UserRepository implements UserRepository {
  constructor(private readonly db: AppDatabase) {}

  async findBySub(sub: string): Promise<User | undefined> {
    const [record] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.sub, sub))
      .limit(1);
    return record ? mapRecordToUser(record) : undefined;
  }

  async save(user: User): Promise<void> {
    const timestamp = new Date().toISOString();
    await this.db
      .insert(usersTable)
      .values({
        id: user.id,
        sub: user.sub,
        email: user.email,
        version: user.version,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          sub: user.sub,
          email: user.email,
          version: user.version,
          updatedAt: timestamp,
        },
      });
  }
}
