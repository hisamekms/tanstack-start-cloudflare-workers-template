import type { Context } from "@contracts/shared-kernel/server";
import type { EnsureUserCommand } from "@contracts/user-public";
import type { UserError } from "@contracts/user-public";
import { createUser, type UserRepository } from "@modules/user-write-model";
import { ResultAsync } from "neverthrow";
import { v7 as uuidv7 } from "uuid";

export class EnsureUserHandler {
  constructor(private readonly repository: UserRepository) {}

  execute(command: EnsureUserCommand, _context: Context): ResultAsync<void, UserError> {
    return ResultAsync.fromSafePromise(
      this.repository.findBySub(command.sub).then((existing) => {
        if (existing) return;
        const id = uuidv7();
        const { state } = createUser(id, command.sub, command.email);
        return this.repository.save(state);
      }),
    );
  }
}
