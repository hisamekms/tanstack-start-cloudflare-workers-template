import { describe, expect, test } from "vitest";

import { CompleteTodoInputSchema, CreateTodoInputSchema } from "./commands";

describe("CreateTodoInputSchema", () => {
  test("accepts a valid title", () => {
    const result = CreateTodoInputSchema.safeParse({ title: "Buy milk" });
    expect(result.success).toBe(true);
  });

  test("trims whitespace from title", () => {
    const result = CreateTodoInputSchema.safeParse({ title: "  Buy milk  " });
    expect(result.success).toBe(true);
    expect(result.data!.title).toBe("Buy milk");
  });

  test("rejects empty string", () => {
    const result = CreateTodoInputSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  test("rejects whitespace-only string", () => {
    const result = CreateTodoInputSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });

  test("rejects title longer than 200 characters", () => {
    const result = CreateTodoInputSchema.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  test("accepts title of exactly 200 characters", () => {
    const result = CreateTodoInputSchema.safeParse({ title: "a".repeat(200) });
    expect(result.success).toBe(true);
  });

  test("rejects non-string title", () => {
    const result = CreateTodoInputSchema.safeParse({ title: 123 });
    expect(result.success).toBe(false);
  });

  test("rejects missing title field", () => {
    const result = CreateTodoInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("CompleteTodoInputSchema", () => {
  test("accepts a valid UUID", () => {
    const result = CompleteTodoInputSchema.safeParse({
      todoId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  test("rejects non-UUID string", () => {
    const result = CompleteTodoInputSchema.safeParse({ todoId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  test("rejects empty string", () => {
    const result = CompleteTodoInputSchema.safeParse({ todoId: "" });
    expect(result.success).toBe(false);
  });

  test("rejects non-string todoId", () => {
    const result = CompleteTodoInputSchema.safeParse({ todoId: 123 });
    expect(result.success).toBe(false);
  });

  test("rejects missing todoId field", () => {
    const result = CompleteTodoInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
