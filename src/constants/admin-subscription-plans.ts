export type AdminSubscriptionPlanCode = 'starter' | 'pro'

export interface AdminSubscriptionPlan {
  code: AdminSubscriptionPlanCode
  name: string
  description: string
  price: number
  badge?: string
  features: string[]
}

export const ADMIN_SUBSCRIPTION_PLANS: AdminSubscriptionPlan[] = [
  {
    code: 'starter',
    name: 'Starter',
    description:
      'Ideal para academias que estan comenzando y quieren lanzar rapido.',
    price: 500000,
    features: [
      'Academia activa por 1 ano',
      'Cursos y estudiantes ilimitados',
      'Pagos integrados con MercadoPago',
      'Soporte por correo',
    ],
  },
  {
    code: 'pro',
    name: 'Pro',
    description:
      'Para academias que buscan una presencia mas solida y crecimiento continuo.',
    price: 900000,
    badge: 'Recomendado',
    features: [
      'Academia activa por 1 ano',
      'Cursos y estudiantes ilimitados',
      'Certificados y herramientas avanzadas',
      'Soporte prioritario',
    ],
  },
]

export function getAdminSubscriptionPlan(code: AdminSubscriptionPlanCode) {
  return ADMIN_SUBSCRIPTION_PLANS.find((plan) => plan.code === code)
}
