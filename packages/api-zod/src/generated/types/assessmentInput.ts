import type { AssessmentInputActivityLevel } from './assessmentInputActivityLevel.js';
import type { AssessmentInputDiet } from './assessmentInputDiet.js';
import type { AssessmentInputFocusDifficulty } from './assessmentInputFocusDifficulty.js';
import type { AssessmentInputGender } from './assessmentInputGender.js';
import type { AssessmentInputHomework } from './assessmentInputHomework.js';
import type { AssessmentInputHyperactivity } from './assessmentInputHyperactivity.js';
import type { AssessmentInputSupplements } from './assessmentInputSupplements.js';
import type { AssessmentInputVegetables } from './assessmentInputVegetables.js';

export interface AssessmentInput {
  parentName: string;
  email: string;
  /** @nullable */
  phone?: string | null;
  childName: string;
  /**
   * @minimum 3
   * @maximum 12
   */
  age: number;
  gender: AssessmentInputGender;
  activityLevel: AssessmentInputActivityLevel;
  focusDifficulty: AssessmentInputFocusDifficulty;
  hyperactivity: AssessmentInputHyperactivity;
  homework: AssessmentInputHomework;
  diet: AssessmentInputDiet;
  vegetables: AssessmentInputVegetables;
  supplements: AssessmentInputSupplements;
  /** @nullable */
  allergies?: string | null;
  /** @nullable */
  medications?: string | null;
  /** @nullable */
  notes?: string | null;
}
