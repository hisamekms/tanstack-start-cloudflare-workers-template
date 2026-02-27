import type { TodoCreatedEvent, TodoCompletedEvent } from "@contracts/todo-public";
import { Entity } from "@modules/shared-kernel-write-model";

export class Todo extends Entity<string> {
  readonly id: string;
  readonly title: string;
  private _completed: boolean;

  get completed(): boolean {
    return this._completed;
  }

  private constructor(id: string, title: string, completed: boolean) {
    super();
    this.id = id;
    this.title = title;
    this._completed = completed;
  }

  static create(id: string, title: string): Todo {
    const todo = new Todo(id, title, false);
    const event: TodoCreatedEvent = {
      eventType: "TodoCreated",
      occurredAt: new Date().toISOString(),
      todoId: id,
      title,
    };
    todo.addEvent(event);
    return todo;
  }

  static reconstruct(id: string, title: string, completed: boolean): Todo {
    return new Todo(id, title, completed);
  }

  complete(): void {
    this._completed = true;
    const event: TodoCompletedEvent = {
      eventType: "TodoCompleted",
      occurredAt: new Date().toISOString(),
      todoId: this.id,
    };
    this.addEvent(event);
  }
}
