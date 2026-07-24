/**
 * api-client/index.ts
 *
 * TanStack Query hooks for the Pure Botanica API.
 * Mirrors the backend's api-zod pattern: types and fetch wrappers
 * live directly inside the frontend source tree — no separate package needed.
 */

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';

// ---------------------------------------------------------------------------
// Base URL management
// ---------------------------------------------------------------------------

let _baseUrl = '';

/** Override the API base URL (called in main.tsx when VITE_API_URL is set). */
export function setBaseUrl(url: string): void {
  _baseUrl = url.replace(/\/$/, '');
}

function apiUrl(path: string): string {
  return `${_baseUrl}${path}`;
}

// ---------------------------------------------------------------------------
// Generic fetch helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 204 No Content — return undefined
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Shared types (derived from the Zod schemas in backend/src/api-zod)
// ---------------------------------------------------------------------------

export type AssessmentRecommendation = 'focus' | 'mineral' | 'both';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'calm' | 'average' | 'very_active';
export type FocusDifficulty = 'never' | 'sometimes' | 'often';
export type Hyperactivity = 'never' | 'sometimes' | 'often';
export type Homework = 'yes' | 'sometimes' | 'no';
export type Diet = 'excellent' | 'good' | 'average' | 'poor';
export type Vegetables = '0' | '1' | '2+' | '3+';
export type Supplements = 'yes' | 'no';

export interface SubmitAssessmentBody {
  parentName: string;
  email: string;
  phone?: string | null;
  childName: string;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  focusDifficulty: FocusDifficulty;
  hyperactivity: Hyperactivity;
  homework: Homework;
  diet: Diet;
  vegetables: Vegetables;
  supplements: Supplements;
  allergies?: string | null;
  medications?: string | null;
  notes?: string | null;
}

export interface AssessmentResponse {
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
  recommendation: AssessmentRecommendation;
  createdAt: string;
}

export interface AdminLoginBody {
  password: string;
}

export interface AdminLoginResponse {
  authenticated: boolean;
}

export interface GetAdminMeResponse {
  authenticated: boolean;
}

export interface GetAdminStatsResponse {
  totalAssessments: number;
  focusCount: number;
  mineralCount: number;
  bothCount: number;
  ageDistribution: Array<{ age: number; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
  recommendationDistribution: Array<{ recommendation: string; count: number }>;
  commonSymptoms: Array<{ symptom: string; count: number }>;
}

export interface ListAdminAssessmentsQueryParams {
  search?: string;
  recommendation?: string;
  page?: number;
  limit?: number;
}

export interface AdminAssessmentListItem {
  id: number;
  parentName: string;
  email: string;
  childName: string;
  age: number;
  gender: string;
  recommendation: string;
  focusScore: number;
  mineralScore: number;
  createdAt: string;
}

export interface ListAdminAssessmentsResponse {
  data: AdminAssessmentListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DeleteAdminAssessmentParams {
  id: number;
}

// ---------------------------------------------------------------------------
// Query key helpers
// ---------------------------------------------------------------------------

export function getListAdminAssessmentsQueryKey(params?: ListAdminAssessmentsQueryParams) {
  return ['admin', 'assessments', 'list', params] as const;
}

export function getGetAssessmentQueryKey(id: number | string) {
  return ['assessments', id] as const;
}

// ---------------------------------------------------------------------------
// Internal option types
// ---------------------------------------------------------------------------

type QueryOpts<TData> = {
  query?: Partial<UseQueryOptions<TData, Error>> & {
    queryKey?: unknown[];
    retry?: number | boolean;
    enabled?: boolean;
  };
};

type MutationOpts<TData, TVariables> = {
  mutation?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>;
};

// ---------------------------------------------------------------------------
// Public API — assessment hooks
// ---------------------------------------------------------------------------

/** POST /api/assessments */
export function useSubmitAssessment(
  options?: MutationOpts<AssessmentResponse, { data: SubmitAssessmentBody }>,
) {
  return useMutation<AssessmentResponse, Error, { data: SubmitAssessmentBody }>({
    mutationFn: ({ data }) =>
      apiFetch<AssessmentResponse>(apiUrl('/api/assessments'), {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

/** GET /api/assessments/:id */
export function useGetAssessment(
  id: number | string | undefined,
  options?: QueryOpts<AssessmentResponse>,
) {
  const { query } = options ?? {};
  return useQuery<AssessmentResponse, Error>({
    queryKey: (query?.queryKey as readonly unknown[]) ?? getGetAssessmentQueryKey(id!),
    queryFn: () => apiFetch<AssessmentResponse>(apiUrl(`/api/assessments/${id}`)),
    enabled: query?.enabled !== undefined ? query.enabled : !!id,
    retry: query?.retry,
    ...query,
  });
}

// ---------------------------------------------------------------------------
// Admin hooks
// ---------------------------------------------------------------------------

/** POST /api/admin/login */
export function useAdminLogin(
  options?: MutationOpts<AdminLoginResponse, { data: AdminLoginBody }>,
) {
  return useMutation<AdminLoginResponse, Error, { data: AdminLoginBody }>({
    mutationFn: ({ data }) =>
      apiFetch<AdminLoginResponse>(apiUrl('/api/admin/login'), {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

/** POST /api/admin/logout */
export function useAdminLogout(
  options?: MutationOpts<void, undefined>,
) {
  return useMutation<void, Error, undefined>({
    mutationFn: () =>
      apiFetch<void>(apiUrl('/api/admin/logout'), { method: 'POST' }),
    ...options?.mutation,
  });
}

/** GET /api/admin/me */
export function useGetAdminMe(options?: QueryOpts<GetAdminMeResponse>) {
  const { query } = options ?? {};
  return useQuery<GetAdminMeResponse, Error>({
    queryKey: (query?.queryKey as readonly unknown[]) ?? ['admin', 'me'],
    queryFn: () => apiFetch<GetAdminMeResponse>(apiUrl('/api/admin/me')),
    retry: query?.retry,
    ...query,
  });
}

/** GET /api/admin/stats */
export function useGetAdminStats(options?: QueryOpts<GetAdminStatsResponse>) {
  const { query } = options ?? {};
  return useQuery<GetAdminStatsResponse, Error>({
    queryKey: (query?.queryKey as readonly unknown[]) ?? ['admin', 'stats'],
    queryFn: () => apiFetch<GetAdminStatsResponse>(apiUrl('/api/admin/stats')),
    enabled: query?.enabled,
    retry: query?.retry,
    ...query,
  });
}

/** GET /api/admin/assessments */
export function useListAdminAssessments(
  params?: ListAdminAssessmentsQueryParams,
  options?: QueryOpts<ListAdminAssessmentsResponse>,
) {
  const { query } = options ?? {};
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.recommendation) searchParams.set('recommendation', params.recommendation);
  if (params?.page != null) searchParams.set('page', String(params.page));
  if (params?.limit != null) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();

  return useQuery<ListAdminAssessmentsResponse, Error>({
    queryKey:
      (query?.queryKey as readonly unknown[]) ?? getListAdminAssessmentsQueryKey(params),
    queryFn: () =>
      apiFetch<ListAdminAssessmentsResponse>(
        apiUrl(`/api/admin/assessments${qs ? `?${qs}` : ''}`),
      ),
    enabled: query?.enabled,
    retry: query?.retry,
    ...query,
  });
}

/** DELETE /api/admin/assessments/:id */
export function useDeleteAdminAssessment(
  options?: MutationOpts<void, DeleteAdminAssessmentParams>,
) {
  return useMutation<void, Error, DeleteAdminAssessmentParams>({
    mutationFn: ({ id }) =>
      apiFetch<void>(apiUrl(`/api/admin/assessments/${id}`), { method: 'DELETE' }),
    ...options?.mutation,
  });
}
