import type { StudentDashboardResponse } from '@/types'
import apiClient from '@/lib/api-client'

class DashboardService {
  async getStudentDashboard(
    academySlug: string
  ): Promise<StudentDashboardResponse> {
    const response = await apiClient.get<StudentDashboardResponse>(
      `/dashboard/academies/${academySlug}/student`
    )
    return response.data
  }
}

const dashboardService = new DashboardService()
export default dashboardService
export { dashboardService }
