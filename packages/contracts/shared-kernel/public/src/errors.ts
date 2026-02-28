export type ErrorCategory = "domain" | "application" | "dependency";

export abstract class AppError extends Error {
  abstract readonly tag: string;
  abstract readonly category: ErrorCategory;

  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  override toString(): string {
    return `[${this.tag}] ${this.message}`;
  }
}

export abstract class DomainError extends AppError {
  readonly category = "domain" as const;
}

export abstract class ApplicationError extends AppError {
  readonly category = "application" as const;
}

export abstract class DependencyError extends AppError {
  readonly category = "dependency" as const;
}

const categoryBaseMap = {
  domain: DomainError,
  application: ApplicationError,
  dependency: DependencyError,
} as const;

export function defineError<TTag extends string, TCategory extends ErrorCategory>(
  tag: TTag,
  category: TCategory,
): new (
  message: string,
  cause?: unknown,
) => InstanceType<(typeof categoryBaseMap)[TCategory]> & {
  readonly tag: TTag;
} {
  const Base = categoryBaseMap[category];

  const cls = class extends (Base as typeof AppError) {
    readonly tag = tag as TTag;
    readonly category = category as TCategory & ErrorCategory;
  };

  Object.defineProperty(cls, "name", { value: tag });

  return cls as never;
}
