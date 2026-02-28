import { describe, expect, test, vi } from "vitest";

import { Container } from "./container";
import { TokenNotRegisteredError } from "./errors";
import { token } from "./token";

describe("token", () => {
  test("creates unique tokens even with the same description", () => {
    const t1 = token<string>("MyService");
    const t2 = token<string>("MyService");

    expect(t1.symbol).not.toBe(t2.symbol);
  });

  test("preserves description", () => {
    const t = token<string>("MyService");

    expect(t.description).toBe("MyService");
  });
});

describe("Container", () => {
  describe("registerValue + resolve", () => {
    test("returns the same instance", () => {
      const container = new Container();
      const t = token<{ name: string }>("Config");
      const value = { name: "test" };

      container.registerValue(t, value);

      expect(container.resolve(t)).toBe(value);
      expect(container.resolve(t)).toBe(value);
    });

    test("throws TokenNotRegisteredError for unregistered token", () => {
      const container = new Container();
      const t = token<string>("Unknown");

      expect(() => container.resolve(t)).toThrow(TokenNotRegisteredError);
      expect(() => container.resolve(t)).toThrow("Token not registered: Unknown");
    });
  });

  describe("transient lifetime", () => {
    test("creates a new instance on every resolve", () => {
      const container = new Container();
      const t = token<object>("Transient");
      const factory = vi.fn(() => ({}));

      container.registerFactory(t, factory);

      const a = container.resolve(t);
      const b = container.resolve(t);

      expect(a).not.toBe(b);
      expect(factory).toHaveBeenCalledTimes(2);
    });
  });

  describe("singleton lifetime", () => {
    test("creates only once and caches", () => {
      const container = new Container();
      const t = token<object>("Singleton");
      const factory = vi.fn(() => ({}));

      container.registerFactory(t, factory, "singleton");

      const a = container.resolve(t);
      const b = container.resolve(t);

      expect(a).toBe(b);
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe("factory with resolver", () => {
    test("resolves other dependencies via the resolver argument", () => {
      const container = new Container();
      const configToken = token<string>("Config");
      const serviceToken = token<{ config: string }>("Service");

      container.registerValue(configToken, "my-config");
      container.registerFactory(serviceToken, (r) => ({
        config: r.resolve(configToken),
      }));

      const service = container.resolve(serviceToken);

      expect(service.config).toBe("my-config");
    });
  });

  describe("scoped lifetime", () => {
    test("returns the same instance within the same scope", () => {
      const container = new Container();
      const t = token<object>("Scoped");

      container.registerFactory(t, () => ({}), "scoped");

      const scope = container.createScope();
      const a = scope.resolve(t);
      const b = scope.resolve(t);

      expect(a).toBe(b);
    });

    test("returns different instances in different scopes", () => {
      const container = new Container();
      const t = token<object>("Scoped");

      container.registerFactory(t, () => ({}), "scoped");

      const scope1 = container.createScope();
      const scope2 = container.createScope();

      expect(scope1.resolve(t)).not.toBe(scope2.resolve(t));
    });
  });

  describe("singleton across scopes", () => {
    test("returns the same instance across different scopes", () => {
      const container = new Container();
      const t = token<object>("Singleton");

      container.registerFactory(t, () => ({}), "singleton");

      const scope1 = container.createScope();
      const scope2 = container.createScope();

      expect(scope1.resolve(t)).toBe(scope2.resolve(t));
    });
  });

  describe("child container", () => {
    test("inherits parent registrations", () => {
      const container = new Container();
      const t = token<string>("Inherited");

      container.registerValue(t, "from-parent");

      const child = container.createScope();

      expect(child.resolve(t)).toBe("from-parent");
    });

    test("can override parent registrations", () => {
      const container = new Container();
      const t = token<string>("Override");

      container.registerValue(t, "parent-value");

      const child = container.createScope();
      child.registerValue(t, "child-value");

      expect(child.resolve(t)).toBe("child-value");
      expect(container.resolve(t)).toBe("parent-value");
    });
  });

  describe("fluent API", () => {
    test("registerValue returns this for chaining", () => {
      const container = new Container();
      const t1 = token<string>("A");
      const t2 = token<number>("B");

      const result = container.registerValue(t1, "hello").registerValue(t2, 42);

      expect(result).toBe(container);
      expect(container.resolve(t1)).toBe("hello");
      expect(container.resolve(t2)).toBe(42);
    });

    test("registerFactory returns this for chaining", () => {
      const container = new Container();
      const t1 = token<string>("A");
      const t2 = token<number>("B");

      const result = container.registerFactory(t1, () => "hello").registerFactory(t2, () => 42);

      expect(result).toBe(container);
      expect(container.resolve(t1)).toBe("hello");
      expect(container.resolve(t2)).toBe(42);
    });
  });

  describe("error messages", () => {
    test("includes token description in error message", () => {
      const container = new Container();
      const t = token<string>("MySpecialService");

      expect(() => container.resolve(t)).toThrow("MySpecialService");
    });

    test("error is instance of TokenNotRegisteredError", () => {
      const container = new Container();
      const t = token<string>("Service");

      try {
        container.resolve(t);
        expect.unreachable("should have thrown");
      } catch (e) {
        expect(e).toBeInstanceOf(TokenNotRegisteredError);
      }
    });
  });
});
