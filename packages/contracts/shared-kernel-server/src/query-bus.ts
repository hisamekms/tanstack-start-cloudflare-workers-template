import type { Query } from "@contracts/shared-kernel-public";
import type { Result } from "neverthrow";

export interface QueryBus<TQuery extends Query = Query, TResult = unknown> {
  execute(query: TQuery): Promise<Result<TResult, string>>;
}
