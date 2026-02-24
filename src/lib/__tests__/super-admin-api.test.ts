import type { GlobalStats, AcademyOverview, SystemHealth } from '../api-client'

describe('Super Admin API Types', () => {
  describe('GlobalStats interface', () => {
    it('should have correct structure', () => {
      const mockStats: GlobalStats = {
        totalAcademies: 12,
        totalUsers: 1247,
        totalCourses: 89,
        totalRevenue: 45230,
        monthlyGrowth: {
          academies: 8.2,
          users: 15.3,
          revenue: 12.7,
        },
      }

      expect(mockStats.totalAcademies).toBe(12)
      expect(mockStats.totalUsers).toBe(1247)
      expect(mockStats.totalCourses).toBe(89)
      expect(mockStats.totalRevenue).toBe(45230)
      expect(mockStats.monthlyGrowth.academies).toBe(8.2)
      expect(mockStats.monthlyGrowth.users).toBe(15.3)
      expect(mockStats.monthlyGrowth.revenue).toBe(12.7)
    })
  })

  describe('AcademyOverview interface', () => {
    it('should have correct structure', () => {
      const mockAcademy: AcademyOverview = {
        id: 1,
        name: 'Tech Academy',
        description: 'Leading technology education platform',
        logo_url: null,
        total_users: 324,
        total_courses: 25,
        total_revenue: 15420,
        created_at: '2024-01-15T10:00:00Z',
        status: 'active',
        creator: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      }

      expect(mockAcademy.id).toBe(1)
      expect(mockAcademy.name).toBe('Tech Academy')
      expect(mockAcademy.status).toBe('active')
      expect(mockAcademy.creator.name).toBe('John Doe')
      expect(mockAcademy.total_users).toBe(324)
      expect(mockAcademy.total_courses).toBe(25)
      expect(mockAcademy.total_revenue).toBe(15420)
    })

    it('should support all status values', () => {
      const statuses: Array<'active' | 'inactive' | 'suspended' | 'pending'> = [
        'active',
        'inactive',
        'suspended',
        'pending',
      ]

      statuses.forEach((status) => {
        const academy: AcademyOverview = {
          id: 1,
          name: 'Test Academy',
          description: 'Test Description',
          logo_url: null,
          total_users: 0,
          total_courses: 0,
          total_revenue: 0,
          created_at: '2024-01-01T00:00:00Z',
          status,
          creator: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
          },
        }

        expect(academy.status).toBe(status)
      })
    })
  })

  describe('SystemHealth interface', () => {
    it('should have correct structure', () => {
      const mockHealth: SystemHealth = {
        database_status: {
          status: 'healthy',
          response_time: 15.2,
        },
        redis_status: {
          status: 'healthy',
        },
        storage_status: {
          status: 'healthy',
          service: 'local',
        },
        active_users_24h: 42,
        recent_errors: [],
        system_load: {
          memory_usage: 65.4,
          cpu_usage: 23.1,
          disk_usage: 45.8,
        },
      }

      expect(mockHealth.database_status.status).toBe('healthy')
      expect(mockHealth.database_status.response_time).toBe(15.2)
      expect(mockHealth.redis_status.status).toBe('healthy')
      expect(mockHealth.storage_status.status).toBe('healthy')
      expect(mockHealth.active_users_24h).toBe(42)
      expect(mockHealth.system_load.memory_usage).toBe(65.4)
      expect(mockHealth.system_load.cpu_usage).toBe(23.1)
      expect(mockHealth.system_load.disk_usage).toBe(45.8)
    })

    it('should support unhealthy status', () => {
      const mockHealth: SystemHealth = {
        database_status: {
          status: 'unhealthy',
          error: 'Connection timeout',
        },
        redis_status: {
          status: 'not_configured',
        },
        storage_status: {
          status: 'unhealthy',
          error: 'Disk full',
        },
        active_users_24h: 0,
        recent_errors: [
          { message: 'Database error', timestamp: '2024-02-10T10:00:00Z' },
        ],
        system_load: {
          memory_usage: 95.2,
          cpu_usage: 87.3,
          disk_usage: 92.1,
        },
      }

      expect(mockHealth.database_status.status).toBe('unhealthy')
      expect(mockHealth.database_status.error).toBe('Connection timeout')
      expect(mockHealth.redis_status.status).toBe('not_configured')
      expect(mockHealth.storage_status.status).toBe('unhealthy')
      expect(mockHealth.recent_errors).toHaveLength(1)
    })
  })
})
