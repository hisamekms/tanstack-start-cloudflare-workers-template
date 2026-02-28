import type { Command } from "@contracts/shared-kernel/public";
import type { CommandBus, Middleware } from "@contracts/shared-kernel/server";
import type { Result } from "neverthrow";

export function withCommandMiddleware<TCommand extends Command>(
  bus: CommandBus<TCommand>,
  middlewares: Middleware<TCommand, void>[],
): CommandBus<TCommand> {
  const pipeline = middlewares.reduceRight<(cmd: TCommand) => Promise<Result<void, string>>>(
    (next, mw) => (cmd: TCommand) => mw(cmd, next),
    (cmd: TCommand) => bus.execute(cmd),
  );
  return { execute: pipeline };
}
