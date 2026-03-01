import type { CommandBus, Context } from "@contracts/shared-kernel/server";
import type { UserCommand } from "@contracts/user-public";
import type { UserError } from "@contracts/user-public";
import type { ResultAsync } from "neverthrow";

export interface UserCommandBus extends CommandBus<UserCommand, UserError> {
  execute(command: UserCommand, context: Context): ResultAsync<void, UserError>;
}
