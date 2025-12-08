import { useState } from 'react'
import type {
  AccessCodeValidationResponse,
  AccessCodeRedemptionResponse,
} from '@/types'
import { CheckCircle, AlertCircle, Loader2, Key } from 'lucide-react'
import {
  useValidateAccessCode,
  useRedeemAccessCode,
} from '@/hooks/use-access-codes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AccessCodeRedemptionProps {
  onSuccess?: (response: AccessCodeRedemptionResponse) => void
}

export function AccessCodeRedemption({ onSuccess }: AccessCodeRedemptionProps) {
  const [code, setCode] = useState('')
  const [validation, setValidation] = useState<AccessCodeValidationResponse | null>(null)
  const [redemptionResult, setRedemptionResult] =
    useState<AccessCodeRedemptionResponse | null>(null)

  const validateCode = useValidateAccessCode()
  const redeemCode = useRedeemAccessCode()

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) return

    try {
      const result = await validateCode.mutateAsync(code.trim().toUpperCase())
      setValidation(result)
      setRedemptionResult(null)
    } catch (_error) {
      setValidation(null)
    }
  }

  const handleRedeem = async () => {
    if (!code.trim()) return

    try {
      const result = await redeemCode.mutateAsync({
        code: code.trim().toUpperCase(),
      })
      setRedemptionResult(result)
      onSuccess?.(result)
    } catch (_error) {
      // Error is handled by the hook
    }
  }

  const handleCodeChange = (value: string) => {
    setCode(value)
    // Reset validation when code changes
    if (validation) {
      setValidation(null)
    }
    if (redemptionResult) {
      setRedemptionResult(null)
    }
  }

  // Show success result
  if (redemptionResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-green-600'>
            <CheckCircle className='h-5 w-5' />
            Successfully Enrolled!
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert>
            <CheckCircle className='h-4 w-4' />
            <AlertTitle>Welcome to the course!</AlertTitle>
            <AlertDescription>{redemptionResult.message}</AlertDescription>
          </Alert>

          {/* Course info */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-2 font-semibold'>
              {redemptionResult.course.title}
            </h3>
            <p className='mb-3 text-sm text-gray-600'>
              {redemptionResult.course.description}
            </p>
            <div className='flex items-center gap-4 text-sm'>
              <Badge variant='secondary'>
                {redemptionResult.course.difficulty_level}
              </Badge>
              <span>{redemptionResult.course.total_lessons} lessons</span>
              <span className='text-green-600'>Free with access code</span>
            </div>
          </div>

          {/* Access code info */}
          <div className='text-sm text-gray-600'>
            <p>Remaining uses: {redemptionResult.access_code.remaining_uses}</p>
            <p>
              Code expires in: {redemptionResult.access_code.days_until_expiry}{' '}
              days
            </p>
          </div>

          <Button
            onClick={() => {
              setCode('')
              setValidation(null)
              setRedemptionResult(null)
            }}
            variant='outline'
            className='w-full'
          >
            Redeem Another Code
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='h-5 w-5' />
          Redeem Access Code
        </CardTitle>
        <CardDescription>
          Enter your access code to get free enrollment in a course
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleValidate} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='access-code'>Access Code</Label>
            <Input
              id='access-code'
              type='text'
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder='Enter your access code'
              className='font-mono uppercase'
              maxLength={20}
            />
          </div>

          {!validation && (
            <Button
              type='submit'
              disabled={!code.trim() || validateCode.isPending}
              className='w-full'
            >
              {validateCode.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Validating...
                </>
              ) : (
                'Check Code'
              )}
            </Button>
          )}
        </form>

        {/* Validation results */}
        {validation && (
          <div className='space-y-4'>
            {validation.valid ? (
              <>
                {validation.already_enrolled ? (
                  <Alert>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Already Enrolled</AlertTitle>
                    <AlertDescription>
                      You are already enrolled in this course:{' '}
                      {validation.course?.title}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <CheckCircle className='h-4 w-4' />
                      <AlertTitle>Valid Access Code!</AlertTitle>
                      <AlertDescription>{validation.message}</AlertDescription>
                    </Alert>

                    {/* Course preview */}
                    {validation.course && (
                      <div className='rounded-lg bg-gray-50 p-4'>
                        <h3 className='mb-2 font-semibold'>
                          {validation.course.title}
                        </h3>
                        <p className='mb-3 text-sm text-gray-600'>
                          {validation.course.description}
                        </p>
                        <div className='flex items-center gap-4 text-sm'>
                          <Badge variant='secondary'>
                            {validation.course.difficulty_level}
                          </Badge>
                          <span>{validation.course.total_lessons} lessons</span>
                        </div>
                      </div>
                    )}

                    {/* Code usage info */}
                    <div className='rounded-lg bg-blue-50 p-3 text-sm'>
                      <p>
                        Remaining uses: {validation.access_code.remaining_uses}
                      </p>
                      <p>
                        Code expires in:{' '}
                        {validation.access_code.days_until_expiry} days
                      </p>
                      <p>
                        Usage:{' '}
                        {validation.access_code.usage_percentage.toFixed(1)}%
                        used
                      </p>
                    </div>

                    <Button
                      onClick={handleRedeem}
                      disabled={redeemCode.isPending}
                      className='w-full'
                    >
                      {redeemCode.isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Enrolling...
                        </>
                      ) : (
                        'Enroll Now (Free)'
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Invalid Access Code</AlertTitle>
                <AlertDescription>{validation.message}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
