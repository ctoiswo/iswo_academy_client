import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Award,
  FileText,
  UserCog,
  Bell,
  Palette,
  Monitor,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { type AcademyMembership } from '@/stores/auth-store'

export function getAcademySidebarData(
  academyId: string, 
  currentAcademy: AcademyMembership | null
): SidebarData {
  const isAdmin = currentAcademy?.user_role === 'admin'
  const isTeacher = currentAcademy?.user_role === 'teacher' || isAdmin
  
  return {
    user: {
      name: 'Academy User',
      email: 'user@academy.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [],
    navGroups: [
      {
        title: 'Academy',
        items: [
          {
            title: 'Dashboard',
            url: `/academy/${academyId}/dashboard`,
            icon: LayoutDashboard,
          },
          {
            title: 'Courses',
            url: `/academy/${academyId}/courses`,
            icon: BookOpen,
          },
          {
            title: 'Students',
            url: `/academy/${academyId}/students`,
            icon: Users,
          },
          ...(isTeacher ? [
            {
              title: 'Teaching',
              icon: GraduationCap,
              items: [
                {
                  title: 'My Courses',
                  url: `/academy/${academyId}/teaching/courses`,
                },
                {
                  title: 'Assignments',
                  url: `/academy/${academyId}/teaching/assignments`,
                },
                {
                  title: 'Grades',
                  url: `/academy/${academyId}/teaching/grades`,
                },
              ],
            },
          ] : []),
          {
            title: 'Calendar',
            url: `/academy/${academyId}/calendar`,
            icon: Calendar,
          },
          {
            title: 'Messages',
            url: `/academy/${academyId}/messages`,
            icon: MessageSquare,
          },
          {
            title: 'Achievements',
            url: `/academy/${academyId}/achievements`,
            icon: Award,
          },
        ],
      },
      ...(isAdmin ? [
        {
          title: 'Administration',
          items: [
            {
              title: 'Analytics',
              url: `/academy/${academyId}/analytics`,
              icon: BarChart3,
            },
            {
              title: 'Reports',
              url: `/academy/${academyId}/reports`,
              icon: FileText,
            },
            {
              title: 'Academy Settings',
              url: `/academy/${academyId}/settings`,
              icon: Settings,
            },
          ],
        },
      ] : []),
      {
        title: 'Personal',
        items: [
          {
            title: 'Settings',
            icon: Settings,
            items: [
              {
                title: 'Profile',
                url: `/academy/${academyId}/profile`,
                icon: UserCog,
              },
              {
                title: 'Notifications',
                url: `/academy/${academyId}/notifications`,
                icon: Bell,
              },
              {
                title: 'Appearance',
                url: `/academy/${academyId}/appearance`,
                icon: Palette,
              },
              {
                title: 'Display',
                url: `/academy/${academyId}/display`,
                icon: Monitor,
              },
            ],
          },
        ],
      },
    ],
  }
}