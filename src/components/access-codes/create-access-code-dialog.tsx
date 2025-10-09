import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useCreateAccessCode } from '@/hooks/use-access-codes'
import { type CreateAccessCodeData } from '@/services/access-code-service'

interface CreateAccessCodeDialogProps {
  courseId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAccessCodeDialog({ 
  courseId, 
  open, 
  onOpenChange 
}: CreateAccessCodeDialogProps) {
  const [usageLimit, setUsageLimit] = useState<string>('20')
  const [expiresAt, setExpiresAt] = useState<Date>()
  const [description, setDescription] = useState('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const createAccessCode = useCreateAccessCode(courseId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expiresAt) {
      return
    }

    const data: CreateAccessCodeData = {
      usage_limit: parseInt(usageLimit),
      expires_at: expiresAt.toISOString(),
      description: description.trim() || undefined,
    }

    createAccessCode.mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
        // Reset form
        setUsageLimit('20')
        setExpiresAt(undefined)
        setDescription('')
      }
    })
  }

  const setQuickExpiry = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setExpiresAt(date)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Access Code</DialogTitle>
          <DialogDescription>
            Generate a new access code to allow students free enrollment in this course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              min="1"
              max="1000"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="How many people can use this code?"
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of students who can use this code
            </p>
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? format(expiresAt, "PPP", { locale: es }) : "Select expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={(date) => {
                    setExpiresAt(date)
                    setDatePickerOpen(false)
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {/* Quick date buttons */}
            <div className="flex gap-2 text-sm">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickExpiry(2)}
              >
                2 days
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickExpiry(7)}
              >
                1 week
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickExpiry(30)}
              >
                1 month
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 'Special promotion for company employees'"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAccessCode.isPending || !expiresAt || !usageLimit}
            >
              {createAccessCode.isPending ? 'Creating...' : 'Create Code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}