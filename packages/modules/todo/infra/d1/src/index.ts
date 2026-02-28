import type { TodoDto } from "@contracts/todo/public";
import type { TodoReadModelStore } from "@modules/todo-read-model";
import type { Todo, TodoRepository } from "@modules/todo-write-model";
import { todosTable, type AppDatabase } from "@platform/db";
import { eq } from "drizzle-orm";

function mapRecordToTodo(record: typeof todosTable.$inferSelect): Todo {
  return {
    id: record.id,
    title: record.title,
    completed: record.completed,
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
    await this.db
      .insert(todosTable)
      .values({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        version: todo.version,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        target: todosTable.id,
        set: {
          title: todo.title,
          completed: todo.completed,
          version: todo.version,
          updatedAt: timestamp,
        },
      });
  }
}

export class D1TodoReadModelStore implements TodoReadModelStore {
  constructor(private readonly db: AppDatabase) {}

  async getAll(): Promise<TodoDto[]> {
    const records = await this.db.select().from(todosTable).orderBy(todosTable.createdAt);
    return records.map(mapRecordToDto);
  }
}
