import type { CreateTodoCommand } from "@contracts/todo-public";
import { Todo, type TodoRepository } from "@modules/todo-write-model";
import { ok, type Result } from "neverthrow";

export class CreateTodoHandler {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CreateTodoCommand): Promise<Result<void, string>> {
    const id = crypto.randomUUID();
    const todo = Todo.create(id, command.title);
    this.repository.save(todo);
    return ok(undefined);
  }
}
