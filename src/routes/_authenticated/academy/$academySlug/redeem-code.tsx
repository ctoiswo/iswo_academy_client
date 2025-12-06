import { createFileRoute } from '@tanstack/react-router'
import RedeemAccessCodePage from '@/pages/redeem-access-code'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/redeem-code')({
  component: RedeemAccessCodePage,
})