import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// Auth.js tables (must match @auth/d1-adapter expectations)
// ---------------------------------------------------------------------------

export const authUsersTable = sqliteTable("users", {
  id: text("id").notNull().primaryKey().default(""),
  name: text("name"),
  email: text("email"),
  emailVerified: text("emailVerified"),
  image: text("image"),
});

export const authAccountsTable = sqliteTable("accounts", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  oauth_token_secret: text("oauth_token_secret"),
  oauth_token: text("oauth_token"),
});

export const authSessionsTable = sqliteTable("sessions", {
  id: text("id").notNull(),
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId").notNull(),
  expires: text("expires").notNull(),
});

export const authVerificationTokensTable = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().primaryKey(),
  expires: text("expires").notNull(),
});

// ---------------------------------------------------------------------------
// App tables
// ---------------------------------------------------------------------------

export const todosTable = sqliteTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  userId: text("user_id").notNull(),
  version: integer("version").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type TodoRow = typeof todosTable.$inferSelect;
export type NewTodoRow = typeof todosTable.$inferInsert;

export const usersTable = sqliteTable("users_app", {
  id: text("id").primaryKey(),
  sub: text("sub").notNull().unique(),
  email: text("email").notNull(),
  version: integer("version").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;
