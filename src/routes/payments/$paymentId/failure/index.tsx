import { createFileRoute } from '@tanstack/react-router'
import PaymentCallbackPage from '@/pages/payment-callback'

export const Route = createFileRoute('/payments/$paymentId/failure/')({
  component: () => <PaymentCallbackPage status='failure' />,
})
