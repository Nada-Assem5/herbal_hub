import type { AgeDistItem } from './ageDistItem.js';
import type { GenderDistItem } from './genderDistItem.js';
import type { RecommendationDistItem } from './recommendationDistItem.js';
import type { SymptomItem } from './symptomItem.js';

export interface AdminStats {
  totalAssessments: number;
  focusCount: number;
  mineralCount: number;
  bothCount: number;
  ageDistribution: AgeDistItem[];
  genderDistribution: GenderDistItem[];
  recommendationDistribution: RecommendationDistItem[];
  commonSymptoms: SymptomItem[];
}
