import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard-service'

export function useStudentDashboard(academySlug: string) {
  return useQuery({
    queryKey: ['student-dashboard', academySlug],
    queryFn: () => dashboardService.getStudentDashboard(academySlug),
    enabled: !!academySlug,
  })
}
