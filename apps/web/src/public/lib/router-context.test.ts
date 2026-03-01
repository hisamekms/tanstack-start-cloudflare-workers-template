import { describe, expect, it } from "vitest";

import type { RouterContext } from "~/public/lib/router-context";

describe("RouterContext", () => {
  it("should accept an object with queryClient property", () => {
    const ctx: RouterContext = {
      queryClient: {} as RouterContext["queryClient"],
      session: null,
    };
    expect(ctx).toHaveProperty("queryClient");
  });
});
