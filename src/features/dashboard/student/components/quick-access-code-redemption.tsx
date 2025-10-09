import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Key, ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AccessCodeRedemption } from '@/components/access-codes/access-code-redemption'
import { type RedemptionResponse } from '@/services/access-code-service'

interface QuickAccessCodeRedemptionProps {
  onSuccess?: (response: RedemptionResponse) => void
}

export function QuickAccessCodeRedemption({ onSuccess }: QuickAccessCodeRedemptionProps) {
  const [showFullRedemption, setShowFullRedemption] = useState(false)
  const navigate = useNavigate()

  const handleSuccess = (response: RedemptionResponse) => {
    onSuccess?.(response)
    // Optionally refresh the page or update the local state
    window.location.reload()
  }

  if (showFullRedemption) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              <CardTitle>Redeem Access Code</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFullRedemption(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AccessCodeRedemption onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Have an Access Code?</h3>
              <p className="text-sm text-blue-700">
                Redeem your code to get free access to premium courses
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFullRedemption(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Redeem Code
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate({ to: '/redeem-code' })}
            >
              Go to Page
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}