import { z } from "zod";

export function querySchema<T extends string>(queryType: T) {
  return z.object({ queryType: z.literal(queryType) });
}

export const QuerySchema = z.object({ queryType: z.string() });

export type Query<TQueryType extends string = string> = {
  readonly queryType: TQueryType;
};
