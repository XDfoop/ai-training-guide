import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const modelTypesTable = pgTable("model_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  gpuVramMin: integer("gpu_vram_min").notNull(),
  gpuVramRecommended: integer("gpu_vram_recommended").notNull(),
  examples: text("examples").array().notNull().default([]),
  useCases: text("use_cases").array().notNull().default([]),
});

export const insertModelTypeSchema = createInsertSchema(modelTypesTable).omit({ id: true });
export type InsertModelType = z.infer<typeof insertModelTypeSchema>;
export type ModelType = typeof modelTypesTable.$inferSelect;
