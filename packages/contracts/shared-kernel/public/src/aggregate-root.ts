import { z } from "zod";

export const AggregateRootSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().nonnegative(),
});

export type AggregateRoot<TId extends string = string> = {
  readonly id: TId;
  readonly version: number;
};
