import { z } from "zod";

export function commandSchema<T extends string>(commandType: T) {
  return z.object({ commandType: z.literal(commandType) });
}

export const CommandSchema = z.object({ commandType: z.string() });

export type Command<TCommandType extends string = string> = {
  readonly commandType: TCommandType;
};
