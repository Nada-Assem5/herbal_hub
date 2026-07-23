import type { AssessmentListItem } from './assessmentListItem.js';

export interface AssessmentListResponse {
  data: AssessmentListItem[];
  total: number;
  page: number;
  limit: number;
}
