import { z } from "zod";

export const AggregateRootSchema = z.object({
  id: z.string(),
  version: z.number(),
});

export type AggregateRoot<TId extends string = string> = {
  readonly id: TId;
  readonly version: number;
};
