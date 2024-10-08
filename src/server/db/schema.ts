import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `RAG-genAI_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersSelect = users.$inferSelect;
export const usersInsert = users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Embeddings

export const embeddings = createTable(
  "embeddings",
  {
    id: serial("id").notNull().primaryKey(),
    vectors: vector("vectors", { dimensions: 768 }).notNull(),
    content: text("content").notNull(),
    playgroundId: varchar("playground_id", { length: 255 })
      .notNull()
      .references(() => playground.id, { onDelete: "cascade" }),
    fileId: varchar("file_id", { length: 255 })
      .notNull()
      .references(() => file.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    vectorIndex: index("embeddings_playground_id_idx").using(
      "hnsw",
      table.vectors.op("vector_cosine_ops"),
    ),
  }),
);

export const insertEmbeddings = embeddings.$inferInsert;
export const selectEmbeddings = embeddings.$inferSelect;

// Files model
export const UploadStatus = pgEnum("status", [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);

export const playground = createTable("playground", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  image: varchar("image"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const playgroundSelect = playground.$inferSelect;
export const playgroundInsert = playground.$inferInsert;

export const file = createTable("file", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  playgroundId: varchar("playground_id")
    .notNull()
    .references(() => playground.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  uploadStatus: UploadStatus("upload_status").default("PENDING"),
  url: varchar("url").notNull(),
  key: varchar("key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const fileSelect = file.$inferSelect;
export const fileInsert = file.$inferInsert;

export const message = createTable("message", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  playgroundId: varchar("playground_id")
    .notNull()
    .references(() => playground.id, { onDelete: "cascade" }),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: varchar("message").notNull().default(""),
  isUserMessage: boolean("is_user_message").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

type messageSelect = typeof message.$inferSelect;
type OmitText = Omit<messageSelect, "message">;
type ModifiedMessage = {
  message: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ModifiedMessage;
