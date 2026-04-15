import { pgTable, serial, text, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { modelTypesTable } from "./model-types";

export const datasetsTable = pgTable("datasets", {
  id: serial("id").primaryKey(),
  modelTypeId: integer("model_type_id").notNull().references(() => modelTypesTable.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  sourceUrl: text("source_url").notNull(),
  sizeGb: real("size_gb").notNull(),
  format: text("format").notNull(),
  license: text("license").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  recordCount: text("record_count").notNull(),
});

export const insertDatasetSchema = createInsertSchema(datasetsTable).omit({ id: true });
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasetsTable.$inferSelect;
