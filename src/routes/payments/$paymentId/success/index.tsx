import { createFileRoute } from '@tanstack/react-router'
import PaymentCallbackPage from '@/pages/payment-callback'

export const Route = createFileRoute('/payments/$paymentId/success/')({
  component: () => <PaymentCallbackPage status='success' />,
})
