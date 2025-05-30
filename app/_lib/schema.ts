import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const session = pgTable("session", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const flightsSearchBookmark = pgTable("flights_search_bookmark", {
    id: uuid("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    searchParams: text("search_params").notNull(),
    departureAt: timestamp("departure_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull()
}, (table) => [
    index("flights_search_bookmark_search_params_idx").on(table.searchParams),
    index("flights_search_bookmark_user_id_idx").on(table.userId),
    index("flights_search_bookmark_departure_at_idx").on(table.departureAt),
    unique("flights_search_bookmark_user_id_search_params_unique").on(table.userId, table.searchParams)
]);

export const flightBookmark = pgTable("flight_bookmark", {
    id: uuid("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
    exId: text("ex_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    searchParams: text("search_params").notNull(),
    duration: text("duration").notNull(),
    airline: text("airline").notNull(),
    departureAt: timestamp("departure_at").notNull(),
    departureIATA: text("departure_iata").notNull(),
    arrivalAt: timestamp("arrival_at").notNull(),
    arrivalIATA: text("arrival_iata").notNull(),
    stops: text("stops").$defaultFn(() => "[]").notNull(),
    price: text("price").notNull(),
    currency: text("currency").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull()
}, (table) => [
    index("flight_bookmark_user_id_idx").on(table.userId),
    index("flight_bookmark_search_params_idx").on(table.searchParams),
    unique("flight_bookmark_user_id_search_params_unique_ex_id").on(table.userId, table.searchParams, table.exId)
]);