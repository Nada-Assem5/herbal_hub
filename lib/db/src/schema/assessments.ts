import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  // Parent info
  parentName: text("parent_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  // Child info
  childName: text("child_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  // Lifestyle
  activityLevel: text("activity_level").notNull(),
  focusDifficulty: text("focus_difficulty").notNull(),
  hyperactivity: text("hyperactivity").notNull(),
  homework: text("homework").notNull(),
  // Nutrition
  diet: text("diet").notNull(),
  vegetables: text("vegetables").notNull(),
  supplements: text("supplements").notNull(),
  // Health
  allergies: text("allergies"),
  medications: text("medications"),
  notes: text("notes"),
  // Scores & result
  focusScore: integer("focus_score").notNull(),
  mineralScore: integer("mineral_score").notNull(),
  recommendation: text("recommendation").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(
  assessmentsTable,
).omit({ id: true, createdAt: true });

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
