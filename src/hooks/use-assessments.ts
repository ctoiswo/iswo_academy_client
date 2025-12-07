import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment-service";
import type {
  AssessmentType,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
} from "@/types";
import { toast } from "sonner";

// Query keys
export const assessmentKeys = {
  all: ["assessments"] as const,
  lists: () => [...assessmentKeys.all, "list"] as const,
  list: (academySlug: string, courseSlug: string, filters?: Record<string, unknown>) =>
    [...assessmentKeys.lists(), academySlug, courseSlug, filters] as const,
  details: () => [...assessmentKeys.all, "detail"] as const,
  detail: (academySlug: string, courseSlug: string, assessmentId: number) =>
    [...assessmentKeys.details(), academySlug, courseSlug, assessmentId] as const,
  statistics: (academySlug: string, courseSlug: string, assessmentId: number) =>
    [...assessmentKeys.all, "statistics", academySlug, courseSlug, assessmentId] as const,
  attempts: (academySlug: string, courseSlug: string, assessmentId: number, status?: string) =>
    [...assessmentKeys.all, "attempts", academySlug, courseSlug, assessmentId, status] as const,
};

// Get all assessments for a course
export function useAssessments(
  academySlug: string,
  courseSlug: string,
  params?: {
    type?: AssessmentType;
    section_id?: number;
    status?: "published" | "draft";
  }
) {
  return useQuery({
    queryKey: assessmentKeys.list(academySlug, courseSlug, params),
    queryFn: () => assessmentService.getAssessments(academySlug, courseSlug, params),
    enabled: !!academySlug && !!courseSlug,
  });
}

// Get a single assessment
export function useAssessment(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  return useQuery({
    queryKey: assessmentKeys.detail(academySlug, courseSlug, assessmentId),
    queryFn: () => assessmentService.getAssessment(academySlug, courseSlug, assessmentId),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  });
}

// Get assessment statistics
export function useAssessmentStatistics(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  return useQuery({
    queryKey: assessmentKeys.statistics(academySlug, courseSlug, assessmentId),
    queryFn: () => assessmentService.getStatistics(academySlug, courseSlug, assessmentId),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  });
}

// Get assessment attempts
export function useAssessmentAttempts(
  academySlug: string,
  courseSlug: string,
  assessmentId: number,
  status?: "completed" | "in_progress"
) {
  return useQuery({
    queryKey: assessmentKeys.attempts(academySlug, courseSlug, assessmentId, status),
    queryFn: () => assessmentService.getAttempts(academySlug, courseSlug, assessmentId, status),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  });
}

// Create assessment
export function useCreateAssessment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssessmentRequest) =>
      assessmentService.createAssessment(academySlug, courseSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      toast.success("Evaluación creada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la evaluación: ${error.message}`);
    },
  });
}

// Update assessment
export function useUpdateAssessment(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAssessmentRequest) =>
      assessmentService.updateAssessment(academySlug, courseSlug, assessmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(academySlug, courseSlug, assessmentId),
      });
      toast.success("Evaluación actualizada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la evaluación: ${error.message}`);
    },
  });
}

// Delete assessment
export function useDeleteAssessment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: number) =>
      assessmentService.deleteAssessment(academySlug, courseSlug, assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      toast.success("Evaluación eliminada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la evaluación: ${error.message}`);
    },
  });
}
