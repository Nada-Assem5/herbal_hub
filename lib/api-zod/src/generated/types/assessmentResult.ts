import type { AssessmentResultRecommendation } from './assessmentResultRecommendation.js';

export interface AssessmentResult {
  id: number;
  parentName: string;
  email: string;
  /** @nullable */
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
  /** @nullable */
  allergies?: string | null;
  /** @nullable */
  medications?: string | null;
  /** @nullable */
  notes?: string | null;
  focusScore: number;
  mineralScore: number;
  recommendation: AssessmentResultRecommendation;
  createdAt: Date;
}
