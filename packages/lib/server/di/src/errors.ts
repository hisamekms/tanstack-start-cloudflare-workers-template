export class TokenNotRegisteredError extends Error {
  constructor(description: string) {
    super(`Token not registered: ${description}`);
    this.name = "TokenNotRegisteredError";
  }
}
