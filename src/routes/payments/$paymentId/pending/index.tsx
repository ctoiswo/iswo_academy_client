import { createFileRoute } from '@tanstack/react-router'
import PaymentCallbackPage from '@/pages/payment-callback'

export const Route = createFileRoute('/payments/$paymentId/pending/')({
  component: () => <PaymentCallbackPage status='pending' />,
})
