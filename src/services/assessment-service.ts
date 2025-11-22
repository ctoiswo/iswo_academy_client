import apiClient from "@/lib/api-client";

export type AssessmentType = "Quiz" | "Exam";

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "multiple_select"
  | "short_answer"
  | "essay"
  | "fill_in_blank"
  | "matching"
  | "ordering";

export interface Answer {
  id?: number;
  answer_text: string;
  is_correct: boolean;
  position: number;
}

export interface Question {
  id?: number;
  question_text: string;
  question_type: QuestionType;
  points: number;
  position: number;
  explanation?: string;
  answers: Answer[];
}

export interface Assessment {
  id: number;
  type: AssessmentType;
  title: string;
  description: string | null;
  section_id: number | null;
  section: {
    id: number;
    title: string;
  } | null;
  passing_score: number;
  attempts_allowed: number | null;
  time_limit_minutes: number | null;
  weight_percentage: number;
  retake_waiting_hours: number;
  question_pool_size: number | null;
  published: boolean;
  randomize_questions: boolean;
  randomize_answers: boolean;
  show_correct_answers: boolean;
  require_all_sections_complete: boolean;
  total_points: number;
  questions_count: number;
  attempts_count: number;
  questions?: Question[];
  created_at: string;
  updated_at: string;
}

export interface AssessmentStatistics {
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  pass_rate: number;
  completion_rate: number;
  total_points: number;
}

export interface AssessmentAttempt {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  attempt_number: number;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  passed: boolean | null;
  status: 'completed' | 'in_progress';
  time_spent_seconds: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface CreateAssessmentData {
  type: AssessmentType;
  title: string;
  description?: string;
  section_id?: number;
  passing_score?: number;
  attempts_allowed?: number;
  time_limit_minutes?: number;
  weight_percentage?: number;
  retake_waiting_hours?: number;
  question_pool_size?: number;
  published?: boolean;
  randomize_questions?: boolean;
  randomize_answers?: boolean;
  show_correct_answers?: boolean;
  require_all_sections_complete?: boolean;
}

export interface UpdateAssessmentData extends Partial<CreateAssessmentData> {}

export const assessmentService = {
  // Get all assessments for a course
  async getAssessments(
    academySlug: string,
    courseSlug: string,
    params?: {
      type?: AssessmentType;
      section_id?: number;
      status?: "published" | "draft";
    }
  ): Promise<Assessment[]> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.section_id) queryParams.append("section_id", params.section_id.toString());
    if (params?.status) queryParams.append("status", params.status);

    const url = `/academies/${academySlug}/courses/${courseSlug}/assessments${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<{ assessments: Assessment[] }>(url);
    return response.data?.assessments || [];
  },

  // Get a single assessment
  async getAssessment(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<Assessment> {
    const response = await apiClient.get<{ assessment: Assessment }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}`
    );
    return response.data.assessment;
  },

  // Create a new assessment
  async createAssessment(
    academySlug: string,
    courseSlug: string,
    data: CreateAssessmentData
  ): Promise<Assessment> {
    const response = await apiClient.post<{ assessment: Assessment }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments`,
      { assessment: data }
    );
    return response.data.assessment;
  },

  // Update an assessment
  async updateAssessment(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    data: UpdateAssessmentData
  ): Promise<Assessment> {
    const response = await apiClient.patch<{ assessment: Assessment }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}`,
      { assessment: data }
    );
    return response.data.assessment;
  },

  // Delete an assessment
  async deleteAssessment(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}`
    );
  },

  // Get assessment statistics
  async getStatistics(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<AssessmentStatistics> {
    const response = await apiClient.get<{ statistics: AssessmentStatistics }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/statistics`
    );
    return response.data.statistics;
  },

  // Get assessment attempts
  async getAttempts(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    status?: "completed" | "in_progress"
  ): Promise<AssessmentAttempt[]> {
    const url = `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/attempts${
      status ? `?status=${status}` : ""
    }`;
    const response = await apiClient.get<{ attempts: AssessmentAttempt[] }>(url);
    return response.data?.attempts || [];
  },
};
