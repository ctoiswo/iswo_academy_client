import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStartAttempt, useSubmitAttempt } from '@/hooks/use-assessments'
import type {
  AssessmentSummary,
  StudentQuestion,
  SubmitAnswer,
  QuizAttemptResult,
} from '@/types'

interface AssessmentPlayerProps {
  academySlug: string
  courseSlug: string
  assessment: AssessmentSummary
  onPassed?: () => void
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function Timer({
  limitMinutes,
  onExpire,
}: {
  limitMinutes: number
  onExpire: () => void
}) {
  const [remaining, setRemaining] = useState(limitMinutes * 60)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [onExpire])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const isWarning = remaining <= 60

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-mono font-medium',
        isWarning
          ? 'bg-destructive/15 text-destructive'
          : 'bg-secondary text-foreground'
      )}
    >
      <Clock className='size-4' />
      {mins}:{secs.toString().padStart(2, '0')}
    </div>
  )
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({
  result,
  assessment,
  onRetry,
}: {
  result: QuizAttemptResult
  assessment: AssessmentSummary
  onRetry: () => void
}) {
  const canRetry =
    assessment.attempts_allowed == null ||
    result.attempt_number < assessment.attempts_allowed

  return (
    <div className='flex flex-col items-center gap-6 py-12 text-center'>
      {result.passed ? (
        <div className='flex size-24 items-center justify-center rounded-full bg-emerald-500/15'>
          <Trophy className='size-12 text-emerald-500' />
        </div>
      ) : (
        <div className='flex size-24 items-center justify-center rounded-full bg-destructive/15'>
          <XCircle className='text-destructive size-12' />
        </div>
      )}

      <div>
        <h2
          className={cn(
            'text-2xl font-bold',
            result.passed ? 'text-emerald-500' : 'text-destructive'
          )}
        >
          {result.passed ? '¡Aprobaste!' : 'No aprobaste'}
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          {result.passed
            ? 'Has completado el quiz exitosamente'
            : `Necesitas ${assessment.passing_score}% para aprobar`}
        </p>
      </div>

      <div className='bg-card border-border flex flex-col items-center gap-1 rounded-xl border px-8 py-5'>
        <span className='text-muted-foreground text-sm'>Tu puntuación</span>
        <span className='text-foreground text-4xl font-bold'>
          {result.percentage != null ? `${Math.round(result.percentage)}%` : '—'}
        </span>
        {result.score != null && result.max_score != null && (
          <span className='text-muted-foreground text-xs'>
            {result.score} / {result.max_score} puntos
          </span>
        )}
      </div>

      {!result.passed && canRetry && (
        <Button onClick={onRetry} variant='outline' className='gap-2'>
          <RotateCcw className='size-4' />
          Intentar de nuevo
        </Button>
      )}
    </div>
  )
}

// ─── AssessmentPlayer ─────────────────────────────────────────────────────────

export function AssessmentPlayer({
  academySlug,
  courseSlug,
  assessment,
  onPassed,
}: AssessmentPlayerProps) {
  const [phase, setPhase] = useState<'intro' | 'taking' | 'result'>('intro')
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [questions, setQuestions] = useState<StudentQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  // Selected answer IDs per question: { [questionId]: number[] }
  const [selections, setSelections] = useState<Record<number, number[]>>({})
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  const startAttempt = useStartAttempt(academySlug, courseSlug)
  const submitAttempt = useSubmitAttempt(academySlug, courseSlug, assessment.id)

  const handleStart = () => {
    startAttempt.mutate(assessment.id, {
      onSuccess: (session) => {
        setAttemptId(session.attempt_id)
        setQuestions(session.questions)
        setSelections({})
        setCurrentIndex(0)
        setPhase('taking')
      },
    })
  }

  const handleRetry = () => {
    setResult(null)
    setPhase('intro')
  }

  const handleExpire = useCallback(() => {
    if (attemptId == null) return
    handleSubmit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, selections])

  const handleSubmit = (fromTimer = false) => {
    if (attemptId == null) return

    const answers: SubmitAnswer[] = questions.map((q) => {
      const selected = selections[q.id] ?? []
      if (
        q.question_type === 'multiple_select'
      ) {
        return { question_id: q.id, answer_ids: selected }
      }
      return { question_id: q.id, answer_id: selected[0] }
    })

    submitAttempt.mutate(
      { attemptId, answers },
      {
        onSuccess: (res) => {
          setResult(res)
          setPhase('result')
          if (res.passed && onPassed) onPassed()
        },
      }
    )
  }

  const currentQuestion = questions[currentIndex]
  const answered = Object.keys(selections).filter(
    (k) => (selections[Number(k)] ?? []).length > 0
  ).length
  const progress = questions.length > 0 ? (answered / questions.length) * 100 : 0

  const toggleAnswer = (answerId: number) => {
    if (!currentQuestion) return
    const isMulti = currentQuestion.question_type === 'multiple_select'
    setSelections((prev) => {
      const current = prev[currentQuestion.id] ?? []
      if (isMulti) {
        return {
          ...prev,
          [currentQuestion.id]: current.includes(answerId)
            ? current.filter((id) => id !== answerId)
            : [...current, answerId],
        }
      }
      return { ...prev, [currentQuestion.id]: [answerId] }
    })
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className='bg-card border-border flex flex-col rounded-xl border'>
        <div className='flex flex-col items-center gap-6 p-8 text-center'>
          <div className='bg-primary/10 flex size-20 items-center justify-center rounded-full'>
            <FileQuestion className='text-primary size-10' />
          </div>
          <div>
            <Badge
              variant='outline'
              className={
                assessment.type === 'Exam'
                  ? 'border-orange-500/40 text-orange-400'
                  : 'border-amber-500/40 text-amber-400'
              }
            >
              {assessment.type === 'Exam' ? 'Examen final' : 'Quiz de sección'}
            </Badge>
            <h2 className='text-foreground mt-3 text-2xl font-bold'>
              {assessment.title}
            </h2>
            {assessment.description && (
              <p className='text-muted-foreground mt-2 max-w-md text-sm leading-relaxed'>
                {assessment.description}
              </p>
            )}
          </div>

          <div className='grid w-full max-w-sm grid-cols-2 gap-3'>
            <div className='bg-secondary rounded-lg p-3 text-center'>
              <p className='text-foreground text-lg font-semibold'>
                {assessment.questions_count}
              </p>
              <p className='text-muted-foreground text-xs'>Preguntas</p>
            </div>
            <div className='bg-secondary rounded-lg p-3 text-center'>
              <p className='text-foreground text-lg font-semibold'>
                {assessment.passing_score}%
              </p>
              <p className='text-muted-foreground text-xs'>Para aprobar</p>
            </div>
            {assessment.time_limit_minutes && (
              <div className='bg-secondary rounded-lg p-3 text-center'>
                <p className='text-foreground text-lg font-semibold'>
                  {assessment.time_limit_minutes} min
                </p>
                <p className='text-muted-foreground text-xs'>Límite de tiempo</p>
              </div>
            )}
            {assessment.attempts_allowed && (
              <div className='bg-secondary rounded-lg p-3 text-center'>
                <p className='text-foreground text-lg font-semibold'>
                  {assessment.attempts_allowed}
                </p>
                <p className='text-muted-foreground text-xs'>Intentos máx.</p>
              </div>
            )}
          </div>

          <Button
            size='lg'
            onClick={handleStart}
            disabled={startAttempt.isPending}
            className='gap-2 px-8'
          >
            {startAttempt.isPending ? 'Iniciando...' : 'Comenzar quiz'}
          </Button>

          {assessment.user_passed && (
            <div className='flex items-center gap-2 text-sm text-emerald-500'>
              <CheckCircle2 className='size-4' />
              Ya aprobaste este quiz
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <div className='bg-card border-border rounded-xl border p-6'>
        <ResultScreen
          result={result}
          assessment={assessment}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  // ── Taking screen ─────────────────────────────────────────────────────────
  if (!currentQuestion) return null

  const selectedForCurrent = selections[currentQuestion.id] ?? []
  const isMultiSelect = currentQuestion.question_type === 'multiple_select'

  return (
    <div className='bg-card border-border flex flex-col rounded-xl border'>
      {/* Header */}
      <div className='border-border flex items-center justify-between border-b px-5 py-4'>
        <div className='flex items-center gap-3'>
          <span className='text-muted-foreground text-sm'>
            {currentIndex + 1} / {questions.length}
          </span>
          <Progress value={progress} className='h-1.5 w-24' />
        </div>
        {assessment.time_limit_minutes && (
          <Timer
            limitMinutes={assessment.time_limit_minutes}
            onExpire={handleExpire}
          />
        )}
      </div>

      {/* Question */}
      <div className='flex flex-1 flex-col gap-6 p-6'>
        <div className='flex items-start gap-3'>
          <span className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold'>
            {currentIndex + 1}
          </span>
          <div>
            <p className='text-foreground text-base font-medium leading-relaxed'>
              {currentQuestion.question_text}
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              {isMultiSelect
                ? 'Selecciona todas las respuestas correctas'
                : 'Selecciona una respuesta'}
              {currentQuestion.points > 1 && ` · ${currentQuestion.points} pts`}
            </p>
          </div>
        </div>

        {/* Answers */}
        <div className='flex flex-col gap-2.5'>
          {currentQuestion.answers.map((answer) => {
            const selected = selectedForCurrent.includes(answer.id)
            return (
              <button
                key={answer.id}
                onClick={() => toggleAnswer(answer.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
                  selected
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-secondary/40 text-foreground hover:border-primary/40 hover:bg-secondary/70'
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isMultiSelect ? 'rounded' : 'rounded-full',
                    selected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                  )}
                >
                  {selected && (
                    <CheckCircle2 className='size-3 text-white' />
                  )}
                </span>
                <span className='text-sm'>{answer.answer_text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className='border-border flex items-center justify-between border-t px-5 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className='gap-1'
        >
          <ChevronLeft className='size-4' />
          Anterior
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            size='sm'
            onClick={() => setCurrentIndex((i) => i + 1)}
            className='gap-1'
          >
            Siguiente
            <ChevronRight className='size-4' />
          </Button>
        ) : (
          <Button
            size='sm'
            onClick={() => handleSubmit()}
            disabled={submitAttempt.isPending}
            className='gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700'
          >
            <Send className='size-4' />
            {submitAttempt.isPending ? 'Enviando...' : 'Entregar'}
          </Button>
        )}
      </div>
    </div>
  )
}
