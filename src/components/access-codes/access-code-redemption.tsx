import { useState, type ReactNode } from 'react'
import type {
  AccessCodeValidationResponse,
  AccessCodeRedemptionResponse,
} from '@/types'
import { CheckCircle, AlertCircle, Loader2, Key } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  renderSuccessActions?: (options: {
    response: AccessCodeRedemptionResponse
    reset: () => void
  }) => ReactNode
}

export function AccessCodeRedemption({
  onSuccess,
  renderSuccessActions,
}: AccessCodeRedemptionProps) {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [validation, setValidation] =
    useState<AccessCodeValidationResponse | null>(null)
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

      // If code is valid and user is not already enrolled, automatically redeem it
      if (result.valid && !result.already_enrolled) {
        await handleRedeem()
      }
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

  const resetRedemptionFlow = () => {
    setCode('')
    setValidation(null)
    setRedemptionResult(null)
  }

  // Show success result
  if (redemptionResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-green-600'>
            <CheckCircle className='h-5 w-5' />
            {t('accessCode.redeem.successTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert>
            <CheckCircle className='h-4 w-4' />
            <AlertTitle>{t('accessCode.redeem.welcomeTitle')}</AlertTitle>
            <AlertDescription>{redemptionResult.message}</AlertDescription>
          </Alert>

          {/* Course info */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-2 font-semibold'>
              {redemptionResult.course.title}
            </h3>
            <p className='text-muted-foreground mb-3 text-sm'>
              {redemptionResult.course.description}
            </p>
            <div className='flex items-center gap-4 text-sm'>
              <Badge variant='secondary'>
                {redemptionResult.course.difficulty_level}
              </Badge>
              <span>
                {redemptionResult.course.total_lessons}{' '}
                {t('accessCode.redeem.lessons')}
              </span>
              <span className='text-green-600'>
                {t('accessCode.redeem.freeWithCode')}
              </span>
            </div>
          </div>

          {/* Access code info */}
          <div className='text-muted-foreground text-sm'>
            <p>
              {t('accessCode.redeem.remainingUses', {
                count: redemptionResult.access_code.remaining_uses,
              })}
            </p>
            <p>
              {t('accessCode.redeem.expiresIn', {
                days: redemptionResult.access_code.days_until_expiry,
              })}
            </p>
          </div>

          {renderSuccessActions ? (
            renderSuccessActions({
              response: redemptionResult,
              reset: resetRedemptionFlow,
            })
          ) : (
            <Button
              onClick={resetRedemptionFlow}
              variant='outline'
              className='w-full'
            >
              {t('accessCode.redeem.redeemAnotherButton')}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='h-5 w-5' />
          {t('accessCode.redeem.cardTitle')}
        </CardTitle>
        <CardDescription>
          {t('accessCode.redeem.cardDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleValidate} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='access-code'>
              {t('accessCode.redeem.inputLabel')}
            </Label>
            <Input
              id='access-code'
              type='text'
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder={t('accessCode.redeem.inputPlaceholder')}
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
                  {t('accessCode.redeem.validating')}
                </>
              ) : (
                t('accessCode.redeem.checkCodeButton')
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
                    <AlertTitle>
                      {t('accessCode.redeem.alreadyEnrolledTitle')}
                    </AlertTitle>
                    <AlertDescription>
                      {t('accessCode.redeem.alreadyEnrolledDescription', {
                        courseTitle: validation.course?.title,
                      })}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <CheckCircle className='h-4 w-4' />
                      <AlertTitle>
                        {t('accessCode.redeem.validCodeTitle')}
                      </AlertTitle>
                      <AlertDescription>{validation.message}</AlertDescription>
                    </Alert>

                    {/* Course preview */}
                    {validation.course && (
                      <div className='rounded-lg bg-gray-50 p-4'>
                        <h3 className='mb-2 font-semibold'>
                          {validation.course.title}
                        </h3>
                        <p className='text-muted-foreground mb-3 text-sm'>
                          {validation.course.description}
                        </p>
                        <div className='flex items-center gap-4 text-sm'>
                          <Badge variant='secondary'>
                            {validation.course.difficulty_level}
                          </Badge>
                          <span>
                            {validation.course.total_lessons}{' '}
                            {t('accessCode.redeem.lessons')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Code usage info */}
                    <div className='rounded-lg bg-blue-50 p-3 text-sm'>
                      <p>
                        {t('accessCode.redeem.remainingUses', {
                          count: validation.access_code.remaining_uses,
                        })}
                      </p>
                      <p>
                        {t('accessCode.redeem.expiresIn', {
                          days: validation.access_code.days_until_expiry,
                        })}
                      </p>
                      <p>
                        {t('accessCode.redeem.usagePercent', {
                          percent:
                            validation.access_code.usage_percentage.toFixed(1),
                        })}
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
                          {t('accessCode.redeem.enrolling')}
                        </>
                      ) : (
                        t('accessCode.redeem.enrollButton')
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>
                  {t('accessCode.redeem.invalidCodeTitle')}
                </AlertTitle>
                <AlertDescription>{validation.message}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
