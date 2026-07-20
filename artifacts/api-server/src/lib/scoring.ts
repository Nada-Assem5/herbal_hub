/**
 * Pure Botanica scoring logic.
 * Modular design: add new products by extending the scoring functions below.
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
}

/** Focus score: hyperactivity, concentration, restlessness, homework difficulty */
export function calcFocusScore(input: ScoringInput): number {
  let score = 0;

  // Hyperactivity / restlessness
  if (input.activityLevel === "very_active") score += 3;

  // Difficulty focusing
  if (input.focusDifficulty === "often") score += 3;
  else if (input.focusDifficulty === "sometimes") score += 1;

  // Moves excessively / can't sit still
  if (input.hyperactivity === "often") score += 2;
  else if (input.hyperactivity === "sometimes") score += 1;

  // Homework difficulty
  if (input.homework === "no") score += 2;
  else if (input.homework === "sometimes") score += 1;

  return score;
}

/** Mineral score: poor diet, low vegetable intake, needs daily nutrition */
export function calcMineralScore(input: ScoringInput): number {
  let score = 0;

  // Poor diet
  if (input.diet === "poor") score += 3;
  else if (input.diet === "average") score += 1;

  // No vegetables
  if (input.vegetables === "0") score += 3;
  else if (input.vegetables === "1") score += 1;

  // Needs daily nutrition supplement
  if (input.supplements === "no") score += 2;

  return score;
}

const FOCUS_THRESHOLD = 4;
const MINERAL_THRESHOLD = 3;

export function calcRecommendation(
  focusScore: number,
  mineralScore: number,
): "focus" | "mineral" | "both" {
  const needsFocus = focusScore >= FOCUS_THRESHOLD;
  const needsMineral = mineralScore >= MINERAL_THRESHOLD;

  if (needsFocus && needsMineral) return "both";
  if (needsFocus) return "focus";
  return "mineral"; // always recommend at least mineral support
}

export function score(input: ScoringInput): ScoringResult {
  const focusScore = calcFocusScore(input);
  const mineralScore = calcMineralScore(input);
  const recommendation = calcRecommendation(focusScore, mineralScore);
  return { focusScore, mineralScore, recommendation };
}
