import { useNavigate } from '@tanstack/react-router'
import type { AccessCodeRedemptionResponse } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AccessCodeRedemption } from '@/components/access-codes/access-code-redemption'

export default function RedeemAccessCodePage() {
  const navigate = useNavigate()

  const handleSuccess = (_response: AccessCodeRedemptionResponse) => {
    // After successful redemption, we could navigate to the course or dashboard
    setTimeout(() => {
      navigate({ to: '/dashboard' })
    }, 3000)
  }

  return (
    <div className='container mx-auto max-w-2xl py-8'>
      {/* Header */}
      <div className='mb-8 flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate({ to: '/dashboard' })}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Dashboard
        </Button>
      </div>

      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-bold'>Redeem Access Code</h1>
        <p className='text-gray-600'>
          Have an access code? Enter it below to get free enrollment in a
          course.
        </p>
      </div>

      {/* Redemption component */}
      <AccessCodeRedemption onSuccess={handleSuccess} />

      {/* Help section */}
      <div className='mt-8 text-center text-sm text-gray-500'>
        <p>
          Access codes are provided by course creators or academy
          administrators.
          <br />
          If you don't have an access code, you can browse our{' '}
          <Button
            variant='link'
            className='h-auto p-0 text-sm'
            onClick={() => navigate({ to: '/courses' })}
          >
            available courses
          </Button>
          .
        </p>
      </div>
    </div>
  )
}
