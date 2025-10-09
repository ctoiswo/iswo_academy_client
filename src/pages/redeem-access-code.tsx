import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AccessCodeRedemption } from '@/components/access-codes/access-code-redemption'
import { type RedemptionResponse } from '@/services/access-code-service'

export default function RedeemAccessCodePage() {
  const navigate = useNavigate()

  const handleSuccess = (_response: RedemptionResponse) => {
    // After successful redemption, we could navigate to the course or dashboard
    setTimeout(() => {
      navigate({ to: '/dashboard' })
    }, 3000)
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Redeem Access Code</h1>
        <p className="text-gray-600">
          Have an access code? Enter it below to get free enrollment in a course.
        </p>
      </div>

      {/* Redemption component */}
      <AccessCodeRedemption onSuccess={handleSuccess} />

      {/* Help section */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Access codes are provided by course creators or academy administrators.
          <br />
          If you don't have an access code, you can browse our{' '}
          <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate({ to: '/courses' })}>
            available courses
          </Button>
          .
        </p>
      </div>
    </div>
  )
}