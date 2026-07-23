import { z } from "zod";

export const insertAssessmentSchema = z.object({
  parentName: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  childName: z.string(),
  age: z.number().int().min(3).max(12),
  gender: z.string(),
  activityLevel: z.string(),
  focusDifficulty: z.string(),
  hyperactivity: z.string(),
  homework: z.string(),
  diet: z.string(),
  vegetables: z.string(),
  supplements: z.string(),
  allergies: z.string().nullable().optional(),
  medications: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  focusScore: z.number().int(),
  mineralScore: z.number().int(),
  recommendation: z.string(),
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export interface Assessment {
  id: number;
  parentName: string;
  email: string;
  phone?: string | null;
  childName: string;
  age: number;
  gender: string;
  activityLevel: string;
  focusDifficulty: string;
  hyperactivity: string;
  homework: string;
  diet: string;
  vegetables: string;
  supplements: string;
  allergies?: string | null;
  medications?: string | null;
  notes?: string | null;
  focusScore: number;
  mineralScore: number;
  recommendation: string;
  createdAt: Date;
}
