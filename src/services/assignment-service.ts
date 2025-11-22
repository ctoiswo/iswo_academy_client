import apiClient from "@/lib/api-client";

export interface Assignment {
  id: number;
  title: string;
  description: string | null;
  instructions: string | null;
  lesson_id: number;
  section_id: number | null;
  max_points: number;
  passing_score: number;
  max_attempts: number;
  require_file_upload: boolean;
  require_text_submission: boolean;
  max_file_uploads: number;
  max_file_size_mb: number;
  allowed_file_types: string[] | null;
  available_from: string | null;
  due_at: string | null;
  late_submission_until: string | null;
  late_penalty_percent: number;
  allow_resubmission: boolean;
  auto_accept_on_time: boolean;
  peer_review_enabled: boolean;
  peer_review_count: number;
  submission_count: number;
  graded_count: number;
  average_score: number;
  available: boolean;
  past_due: boolean;
  accepting_submissions: boolean;
  days_until_due: number | null;
  lesson: {
    id: number;
    title: string;
  } | null;
  section: {
    id: number;
    title: string;
  } | null;
  creator: {
    id: number;
    name: string;
  };
  rubric?: RubricCriterion[];
  rubric_criteria?: RubricCriterion[];
  total_rubric_points?: number;
  created_at: string;
  updated_at: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  max_points: number;
}

export interface AssignmentStatistics {
  submission_count: number;
  graded_count: number;
  average_score: number;
  completion_rate: number;
  on_time_rate: number;
  pending_grading_count: number;
}

export interface AssignmentSubmission {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  status: "not_started" | "in_progress" | "submitted" | "graded";
  submitted_at: string | null;
  graded_at: string | null;
  score: number | null;
  feedback: string | null;
  is_late: boolean;
  attempt_number: number;
  attachments_count: number;
}

export interface CreateAssignmentData {
  title: string;
  description?: string;
  instructions?: string;
  lesson_id: number;
  section_id?: number;
  max_points?: number;
  passing_score?: number;
  max_attempts?: number;
  require_file_upload?: boolean;
  require_text_submission?: boolean;
  max_file_uploads?: number;
  max_file_size_mb?: number;
  allowed_file_types?: string[];
  available_from?: string;
  due_at?: string;
  late_submission_until?: string;
  late_penalty_percent?: number;
  allow_resubmission?: boolean;
  auto_accept_on_time?: boolean;
  peer_review_enabled?: boolean;
  peer_review_count?: number;
  rubric?: RubricCriterion[];
}

export interface UpdateAssignmentData extends Partial<CreateAssignmentData> {}

export const assignmentService = {
  // Get all assignments for a course
  async getAssignments(
    academySlug: string,
    courseSlug: string,
    params?: {
      section_id?: number;
      status?: "active" | "past_due" | "upcoming";
    }
  ): Promise<Assignment[]> {
    const queryParams = new URLSearchParams();
    if (params?.section_id) queryParams.append("section_id", params.section_id.toString());
    if (params?.status) queryParams.append("status", params.status);
    
    const url = `/academies/${academySlug}/courses/${courseSlug}/assignments${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    
    const response = await apiClient.get<{ assignments: Assignment[] }>(url);
    return response.data?.assignments || [];
  },

  // Get a single assignment
  async getAssignment(
    academySlug: string,
    courseSlug: string,
    assignmentId: number
  ): Promise<Assignment> {
    const response = await apiClient.get<{ assignment: Assignment }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}`
    );
    return response.data.assignment;
  },

  // Create a new assignment
  async createAssignment(
    academySlug: string,
    courseSlug: string,
    data: CreateAssignmentData
  ): Promise<Assignment> {
    const response = await apiClient.post<{ assignment: Assignment }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments`,
      { assignment: data }
    );
    return response.data.assignment;
  },

  // Update an assignment
  async updateAssignment(
    academySlug: string,
    courseSlug: string,
    assignmentId: number,
    data: UpdateAssignmentData
  ): Promise<Assignment> {
    const response = await apiClient.patch<{ assignment: Assignment }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}`,
      { assignment: data }
    );
    return response.data.assignment;
  },

  // Delete an assignment
  async deleteAssignment(
    academySlug: string,
    courseSlug: string,
    assignmentId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}`
    );
  },

  // Get assignment statistics
  async getStatistics(
    academySlug: string,
    courseSlug: string,
    assignmentId: number
  ): Promise<AssignmentStatistics> {
    const response = await apiClient.get<{ statistics: AssignmentStatistics }>(
      `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}/statistics`
    );
    return response.data.statistics;
  },

  // Get assignment submissions
  async getSubmissions(
    academySlug: string,
    courseSlug: string,
    assignmentId: number,
    status?: string
  ): Promise<AssignmentSubmission[]> {
    const url = `/academies/${academySlug}/courses/${courseSlug}/assignments/${assignmentId}/submissions${
      status ? `?status=${status}` : ""
    }`;
    const response = await apiClient.get<{ submissions: AssignmentSubmission[] }>(url);
    return response.data?.submissions || [];
  },
};
