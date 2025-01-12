import { sql } from "drizzle-orm";
import { text, sqliteTable, integer, real } from "drizzle-orm/sqlite-core";

export const slicesTable = sqliteTable("slices", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Slice = typeof slicesTable.$inferSelect;

export const productsTable = sqliteTable("products", {
  id: text("id").primaryKey(),
  sliceId: text("slice_id")
    .notNull()
    .references(() => slicesTable.id),
  name: text("name").notNull(),
  images: text("images").notNull(), // JSON string array of URLs
  price: real("price").notNull(),
  currencyAddress: text("currency_address").notNull(),
  currencySymbol: text("currency_symbol").notNull(),
  currencyDecimals: integer("currency_decimals").notNull(),
  availableUnits: integer("available_units").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Product = typeof productsTable.$inferSelect;
