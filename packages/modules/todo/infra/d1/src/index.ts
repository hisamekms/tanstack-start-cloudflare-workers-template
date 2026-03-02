import { OptimisticLockError } from "@contracts/shared-kernel/public";
import type { TodoDto } from "@contracts/todo-public";
import type { TodoReadModelStore } from "@modules/todo-read-model";
import type { Todo, TodoRepository } from "@modules/todo-write-model";
import { todosTable, type AppDatabase } from "@platform/db-d1";
import { and, eq } from "drizzle-orm";

function mapRecordToTodo(record: typeof todosTable.$inferSelect): Todo {
  return {
    id: record.id,
    title: record.title,
    completed: record.completed,
    userId: record.userId,
    version: record.version,
  };
}

function mapRecordToDto(record: typeof todosTable.$inferSelect): TodoDto {
  return {
    id: record.id,
    title: record.title,
    completed: record.completed,
  };
}

export class D1TodoRepository implements TodoRepository {
  constructor(private readonly db: AppDatabase) {}

  async findById(id: string): Promise<Todo | undefined> {
    const [record] = await this.db.select().from(todosTable).where(eq(todosTable.id, id)).limit(1);
    return record ? mapRecordToTodo(record) : undefined;
  }

  async save(todo: Todo): Promise<void> {
    const timestamp = new Date().toISOString();

    if (todo.version === 1) {
      await this.db.insert(todosTable).values({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId,
        version: todo.version,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    } else {
      const result = await this.db
        .update(todosTable)
        .set({
          title: todo.title,
          completed: todo.completed,
          version: todo.version,
          updatedAt: timestamp,
        })
        .where(and(eq(todosTable.id, todo.id), eq(todosTable.version, todo.version - 1)))
        .run();

      if (result.meta.changes === 0) {
        throw new OptimisticLockError("Todo", todo.id, todo.version);
      }
    }
  }
}

export class D1TodoReadModelStore implements TodoReadModelStore {
  constructor(private readonly db: AppDatabase) {}

  async getAll(): Promise<TodoDto[]> {
    const records = await this.db.select().from(todosTable).orderBy(todosTable.createdAt);
    return records.map(mapRecordToDto);
  }

  async getByUserId(userId: string): Promise<TodoDto[]> {
    const records = await this.db
      .select()
      .from(todosTable)
      .where(eq(todosTable.userId, userId))
      .orderBy(todosTable.createdAt);
    return records.map(mapRecordToDto);
  }
}
