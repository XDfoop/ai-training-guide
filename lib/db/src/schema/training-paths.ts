import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { modelTypesTable } from "./model-types";

export const trainingPathsTable = pgTable("training_paths", {
  id: serial("id").primaryKey(),
  modelTypeId: integer("model_type_id").notNull().references(() => modelTypesTable.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull().$type<"beginner" | "intermediate" | "advanced">(),
  estimatedHours: integer("estimated_hours").notNull(),
  gpuVramRequired: integer("gpu_vram_required").notNull(),
  canStack: boolean("can_stack").notNull().default(false),
  stackNote: text("stack_note").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trainingStepsTable = pgTable("training_steps", {
  id: serial("id").primaryKey(),
  pathId: integer("path_id").notNull().references(() => trainingPathsTable.id),
  stepOrder: integer("step_order").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  codeSnippet: text("code_snippet").notNull().default(""),
  resources: text("resources").array().notNull().default([]),
  tips: text("tips").notNull().default(""),
});

export const insertTrainingPathSchema = createInsertSchema(trainingPathsTable).omit({ id: true, createdAt: true });
export type InsertTrainingPath = z.infer<typeof insertTrainingPathSchema>;
export type TrainingPath = typeof trainingPathsTable.$inferSelect;

export const insertTrainingStepSchema = createInsertSchema(trainingStepsTable).omit({ id: true });
export type InsertTrainingStep = z.infer<typeof insertTrainingStepSchema>;
export type TrainingStep = typeof trainingStepsTable.$inferSelect;
