import { describe, expect, test } from "vitest";

import { createUser } from "./user";

describe("createUser", () => {
  test("returns state with correct properties", () => {
    const { state } = createUser("u-1", "sub-abc", "alice@example.com");

    expect(state).toEqual({
      id: "u-1",
      sub: "sub-abc",
      email: "alice@example.com",
      version: 1,
    });
  });

  test("returns a UserCreatedEvent", () => {
    const { events } = createUser("u-1", "sub-abc", "alice@example.com");

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(
      expect.objectContaining({
        eventType: "UserCreated",
        schemaVersion: 1,
        aggregateVersion: 1,
        userId: "u-1",
        sub: "sub-abc",
        email: "alice@example.com",
      }),
    );
    expect(typeof events[0]!.occurredAt).toBe("string");
  });
});
