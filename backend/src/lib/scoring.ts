/**
 * Pure Botanica explicit point-based scoring logic.
 * Each question awards points independently to Focus and/or Mineral.
 */

export type ActivityLevel = "calm" | "average" | "very_active";
export type FocusDifficulty = "never" | "sometimes" | "often";
export type Hyperactivity = "never" | "sometimes" | "often";
export type Homework = "yes" | "sometimes" | "no";
export type Diet = "excellent" | "good" | "average" | "poor";
export type Vegetables = "0" | "1" | "2+" | "3+";

export interface ScoringInput {
  activityLevel: ActivityLevel;
  focusDifficulty: FocusDifficulty;
  hyperactivity: Hyperactivity;
  homework: Homework;
  diet: Diet;
  vegetables: Vegetables;
  supplements: string;
}

export interface ScoringResult {
  focusScore: number;
  mineralScore: number;
  recommendation: "focus" | "mineral" | "both";
  isLightRecommendation?: boolean;
}

export interface PointsRule {
  focus: number;
  mineral: number;
}

export const QUESTION_RULES: Record<string, Record<string, PointsRule>> = {
  activityLevel: {
    calm: { focus: 0, mineral: 0 },
    average: { focus: 1, mineral: 0 },
    very_active: { focus: 3, mineral: 0 },
  },
  focusDifficulty: {
    never: { focus: 0, mineral: 0 },
    sometimes: { focus: 1, mineral: 0 },
    often: { focus: 3, mineral: 0 },
  },
  hyperactivity: {
    never: { focus: 0, mineral: 0 },
    sometimes: { focus: 1, mineral: 0 },
    often: { focus: 3, mineral: 0 },
  },
  homework: {
    no: { focus: 0, mineral: 0 },
    sometimes: { focus: 1, mineral: 0 },
    yes: { focus: 3, mineral: 0 },
  },
  diet: {
    excellent: { focus: 0, mineral: 0 },
    good: { focus: 0, mineral: 1 },
    average: { focus: 0, mineral: 2 },
    poor: { focus: 0, mineral: 3 },
  },
  vegetables: {
    "3+": { focus: 0, mineral: 0 },
    "2+": { focus: 0, mineral: 1 },
    "1": { focus: 0, mineral: 2 },
    "0": { focus: 0, mineral: 3 },
  },
  supplements: {
    yes: { focus: 0, mineral: 0 },
    no: { focus: 0, mineral: 2 },
  },
};

export const FOCUS_MAX_SCORE = 12;
export const MINERAL_MAX_SCORE = 8;
export const FOCUS_THRESHOLD = 6;
export const MINERAL_THRESHOLD = 4;

export function calcFocusScore(input: ScoringInput): number {
  return (
    (QUESTION_RULES.activityLevel[input.activityLevel]?.focus ?? 0) +
    (QUESTION_RULES.focusDifficulty[input.focusDifficulty]?.focus ?? 0) +
    (QUESTION_RULES.hyperactivity[input.hyperactivity]?.focus ?? 0) +
    (QUESTION_RULES.homework[input.homework]?.focus ?? 0)
  );
}

export function calcMineralScore(input: ScoringInput): number {
  return (
    (QUESTION_RULES.diet[input.diet]?.mineral ?? 0) +
    (QUESTION_RULES.vegetables[input.vegetables]?.mineral ?? 0) +
    (QUESTION_RULES.supplements[input.supplements]?.mineral ?? 0)
  );
}

export function calcRecommendation(
  focusScore: number,
  mineralScore: number,
): "focus" | "mineral" | "both" {
  const needsFocus = focusScore >= FOCUS_THRESHOLD;
  const needsMineral = mineralScore >= MINERAL_THRESHOLD;

  if (needsFocus && needsMineral) return "both";
  if (needsFocus) return "focus";
  if (needsMineral) return "mineral";

  // Neither threshold met: recommend product with higher relative score
  const focusRatio = focusScore / FOCUS_MAX_SCORE;
  const mineralRatio = mineralScore / MINERAL_MAX_SCORE;
  return focusRatio >= mineralRatio ? "focus" : "mineral";
}

export function score(input: ScoringInput): ScoringResult {
  const focusScore = calcFocusScore(input);
  const mineralScore = calcMineralScore(input);
  const recommendation = calcRecommendation(focusScore, mineralScore);
  const isLightRecommendation = focusScore < FOCUS_THRESHOLD && mineralScore < MINERAL_THRESHOLD;
  return { focusScore, mineralScore, recommendation, isLightRecommendation };
}
