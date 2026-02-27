import { describe, expect, it } from "vitest";
import type { RouterContext } from "~/lib/router-context";

describe("RouterContext", () => {
  it("should accept an object with queryClient property", () => {
    const ctx: RouterContext = {
      queryClient: {} as RouterContext["queryClient"],
    };
    expect(ctx).toHaveProperty("queryClient");
  });
});
