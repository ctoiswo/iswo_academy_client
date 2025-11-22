import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentService, type CreateAssignmentData, type UpdateAssignmentData } from "@/services/assignment-service";
import { toast } from "sonner";

// Query keys
export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (academySlug: string, courseSlug: string, filters?: Record<string, unknown>) =>
    [...assignmentKeys.lists(), academySlug, courseSlug, filters] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (academySlug: string, courseSlug: string, assignmentId: number) =>
    [...assignmentKeys.details(), academySlug, courseSlug, assignmentId] as const,
  statistics: (academySlug: string, courseSlug: string, assignmentId: number) =>
    [...assignmentKeys.all, "statistics", academySlug, courseSlug, assignmentId] as const,
  submissions: (academySlug: string, courseSlug: string, assignmentId: number, status?: string) =>
    [...assignmentKeys.all, "submissions", academySlug, courseSlug, assignmentId, status] as const,
};

// Get all assignments for a course
export function useAssignments(
  academySlug: string,
  courseSlug: string,
  params?: {
    section_id?: number;
    status?: "active" | "past_due" | "upcoming";
  }
) {
  return useQuery({
    queryKey: assignmentKeys.list(academySlug, courseSlug, params),
    queryFn: () => assignmentService.getAssignments(academySlug, courseSlug, params),
    enabled: !!academySlug && !!courseSlug,
  });
}

// Get a single assignment
export function useAssignment(
  academySlug: string,
  courseSlug: string,
  assignmentId: number
) {
  return useQuery({
    queryKey: assignmentKeys.detail(academySlug, courseSlug, assignmentId),
    queryFn: () => assignmentService.getAssignment(academySlug, courseSlug, assignmentId),
    enabled: !!academySlug && !!courseSlug && !!assignmentId,
  });
}

// Get assignment statistics
export function useAssignmentStatistics(
  academySlug: string,
  courseSlug: string,
  assignmentId: number
) {
  return useQuery({
    queryKey: assignmentKeys.statistics(academySlug, courseSlug, assignmentId),
    queryFn: () => assignmentService.getStatistics(academySlug, courseSlug, assignmentId),
    enabled: !!academySlug && !!courseSlug && !!assignmentId,
  });
}

// Get assignment submissions
export function useAssignmentSubmissions(
  academySlug: string,
  courseSlug: string,
  assignmentId: number,
  status?: string
) {
  return useQuery({
    queryKey: assignmentKeys.submissions(academySlug, courseSlug, assignmentId, status),
    queryFn: () => assignmentService.getSubmissions(academySlug, courseSlug, assignmentId, status),
    enabled: !!academySlug && !!courseSlug && !!assignmentId,
  });
}

// Create assignment
export function useCreateAssignment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentData) =>
      assignmentService.createAssignment(academySlug, courseSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Tarea creada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la tarea: ${error.message}`);
    },
  });
}

// Update assignment
export function useUpdateAssignment(
  academySlug: string,
  courseSlug: string,
  assignmentId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAssignmentData) =>
      assignmentService.updateAssignment(academySlug, courseSlug, assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(academySlug, courseSlug, assignmentId),
      });
      toast.success("Tarea actualizada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la tarea: ${error.message}`);
    },
  });
}

// Delete assignment
export function useDeleteAssignment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) =>
      assignmentService.deleteAssignment(academySlug, courseSlug, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      toast.success("Tarea eliminada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la tarea: ${error.message}`);
    },
  });
}
