export type PublicContext = { readonly kind: "public" };

export type ProtectedContext = { readonly kind: "protected"; readonly userId: string };

export type Context = PublicContext | ProtectedContext;

export function createPublicContext(): PublicContext {
  return { kind: "public" };
}

export function createProtectedContext(userId: string): ProtectedContext {
  return { kind: "protected", userId };
}
