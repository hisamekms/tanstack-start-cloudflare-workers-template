import type { Query } from "@contracts/shared-kernel-public";

export interface QueryBus<TQuery extends Query = Query, TResult = unknown> {
  execute(query: TQuery): Promise<TResult>;
}
