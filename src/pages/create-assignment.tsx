import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  ClipboardList,
  Save,
  Eye,
  Sparkles,
  Calendar,
  Target,
  Upload,
  FileText,
  Users,
  Plus,
  Trash2,
  GripVertical,
  Info,
} from 'lucide-react'
import { useCreateAssignment } from '@/hooks/use-assignments'
import { useLessons } from '@/hooks/use-lessons'
import { useSections } from '@/hooks/use-sections'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/editor/rich-text-editor'

interface RubricCriterion {
  id: string
  name: string
  description: string
  max_points: number
}

export default function CreateAssignmentPage() {
  const { academySlug, courseSlug } = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const navigate = useNavigate()

  // Basic info
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState<string>('')
  const [selectedLessonId, setSelectedLessonId] = useState<string>('')

  // Scoring
  const [maxPoints, setMaxPoints] = useState('100')
  const [passingScore, setPassingScore] = useState('70')
  const [maxAttempts, setMaxAttempts] = useState('1')

  // Dates
  const [availableFrom, setAvailableFrom] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [lateSubmissionUntil, setLateSubmissionUntil] = useState('')
  const [latePenaltyPercent, setLatePenaltyPercent] = useState('10')

  // Submission settings
  const [requireTextSubmission, setRequireTextSubmission] = useState(true)
  const [requireFileUpload, setRequireFileUpload] = useState(false)
  const [maxFileUploads, setMaxFileUploads] = useState('5')
  const [maxFileSizeMb, setMaxFileSizeMb] = useState('10')
  const [allowResubmission, setAllowResubmission] = useState(false)
  const [autoAcceptOnTime, setAutoAcceptOnTime] = useState(false)

  // Peer review
  const [peerReviewEnabled, setPeerReviewEnabled] = useState(false)
  const [peerReviewCount, setPeerReviewCount] = useState('2')

  // Rubric
  const [showRubric, setShowRubric] = useState(false)
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([])

  const { data: sections = [] } = useSections(academySlug, courseSlug)
  const sectionIdForLessons = selectedSectionId
    ? Number(selectedSectionId)
    : sections[0]?.id || 0
  const { data: lessons = [] } = useLessons(
    academySlug,
    courseSlug,
    sectionIdForLessons
  )

  const createAssignment = useCreateAssignment(academySlug, courseSlug)

  // Reset lesson when section changes
  useEffect(() => {
    setSelectedLessonId('')
  }, [selectedSectionId])

  const totalRubricPoints = rubricCriteria.reduce(
    (sum, c) => sum + c.max_points,
    0
  )

  const addRubricCriterion = () => {
    setRubricCriteria([
      ...rubricCriteria,
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        max_points: 10,
      },
    ])
  }

  const removeRubricCriterion = (id: string) => {
    setRubricCriteria(rubricCriteria.filter((c) => c.id !== id))
  }

  const updateRubricCriterion = (
    id: string,
    field: keyof RubricCriterion,
    value: string | number
  ) => {
    setRubricCriteria(
      rubricCriteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const canSubmit = title.trim() && selectedLessonId

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canSubmit) return

    const payload = {
      title,
      description: description || undefined,
      instructions: instructions || undefined,
      section_id: selectedSectionId ? Number(selectedSectionId) : undefined,
      lesson_id: Number(selectedLessonId),
      max_points: Number(maxPoints),
      passing_score: Number(passingScore),
      max_attempts: Number(maxAttempts),
      available_from: availableFrom || undefined,
      due_at: dueAt || undefined,
      late_submission_until: lateSubmissionUntil || undefined,
      late_penalty_percent: Number(latePenaltyPercent),
      require_text_submission: requireTextSubmission,
      require_file_upload: requireFileUpload,
      max_file_uploads: Number(maxFileUploads),
      max_file_size_mb: Number(maxFileSizeMb),
      allow_resubmission: allowResubmission,
      auto_accept_on_time: autoAcceptOnTime,
      peer_review_enabled: peerReviewEnabled,
      peer_review_count: Number(peerReviewCount),
      rubric:
        showRubric && rubricCriteria.length > 0 ? rubricCriteria : undefined,
    }

    createAssignment.mutate(payload, {
      onSuccess: () => {
        navigate({
          to: '/academy/$academySlug/courses/$courseSlug/assignments',
          params: { academySlug, courseSlug },
        })
      },
    })
  }

  return (
    <div className='bg-background relative flex min-h-screen flex-col'>
      {/* Background grid */}
      <div
        className='pointer-events-none fixed inset-0 opacity-[0.025]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden='true'
      />

      {/* Top glow */}
      <div
        className='bg-primary pointer-events-none fixed top-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full opacity-15 blur-[140px]'
        aria-hidden='true'
      />

      {/* Header */}
      <header className='border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl'>
        <div className='mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={() =>
                navigate({
                  to: '/academy/$academySlug/courses/$courseSlug/assignments',
                  params: { academySlug, courseSlug },
                })
              }
              className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors'
            >
              <ArrowLeft className='size-4' />
              <span className='hidden sm:inline'>Volver</span>
            </button>
            <div className='bg-border hidden h-6 w-px sm:block' />
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-xs'>
                {courseSlug}
              </span>
              <span className='text-foreground text-sm font-medium'>
                Nueva Tarea
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='text-muted-foreground gap-2'
              type='button'
            >
              <Eye className='size-4' />
              <span className='hidden sm:inline'>Vista previa</span>
            </Button>
            <Button
              size='sm'
              className='gap-2'
              onClick={handleSubmit}
              disabled={!canSubmit || createAssignment.isPending}
              type='button'
            >
              {createAssignment.isPending ? (
                <div className='border-primary-foreground size-4 animate-spin rounded-full border-2 border-t-transparent' />
              ) : (
                <Save className='size-4' />
              )}
              <span className='hidden sm:inline'>Guardar tarea</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-8'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          {/* Page header */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 border-primary/20 flex size-12 items-center justify-center rounded-xl border'>
                <ClipboardList className='text-primary size-6' />
              </div>
              <div>
                <h1 className='text-foreground text-2xl font-bold tracking-tight'>
                  Crear Nueva Tarea
                </h1>
                <p className='text-muted-foreground text-sm'>
                  Configura una tarea para evaluar a los estudiantes
                </p>
              </div>
            </div>
          </div>

          {/* Two column layout */}
          <div className='grid gap-8 lg:grid-cols-[1fr,380px]'>
            {/* Left column */}
            <div className='flex flex-col gap-6'>
              {/* Basic Info */}
              <section className='border-border/60 bg-card rounded-xl border p-6'>
                <div className='mb-5 flex items-center gap-3'>
                  <div className='bg-primary/10 flex size-9 items-center justify-center rounded-lg'>
                    <FileText className='text-primary size-4' />
                  </div>
                  <h2 className='text-foreground text-base font-semibold'>
                    Información Básica
                  </h2>
                </div>

                <div className='flex flex-col gap-5'>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor='title' className='text-sm font-medium'>
                      Título de la tarea{' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='title'
                      placeholder='Ej: Trabajo Final - Análisis de Datos'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='bg-secondary/40 border-border/60 focus:border-primary/50 h-11'
                    />
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label
                      htmlFor='description'
                      className='text-sm font-medium'
                    >
                      Descripción breve
                    </Label>
                    <Textarea
                      id='description'
                      placeholder='Una descripción corta de la tarea...'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className='bg-secondary/40 border-border/60 focus:border-primary/50 resize-none'
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='flex flex-col gap-2'>
                      <Label className='text-sm font-medium'>Sección</Label>
                      <Select
                        value={selectedSectionId}
                        onValueChange={setSelectedSectionId}
                      >
                        <SelectTrigger className='bg-secondary/40 border-border/60 h-11'>
                          <SelectValue placeholder='Seleccionar sección' />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem
                              key={section.id}
                              value={String(section.id)}
                            >
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label className='text-sm font-medium'>
                        Lección asociada{' '}
                        <span className='text-destructive'>*</span>
                      </Label>
                      <Select
                        value={selectedLessonId}
                        onValueChange={setSelectedLessonId}
                      >
                        <SelectTrigger className='bg-secondary/40 border-border/60 h-11'>
                          <SelectValue placeholder='Seleccionar lección' />
                        </SelectTrigger>
                        <SelectContent>
                          {lessons.map((lesson) => (
                            <SelectItem
                              key={lesson.id}
                              value={String(lesson.id)}
                            >
                              {lesson.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Instructions */}
              <section className='border-border/60 bg-card rounded-xl border p-6'>
                <div className='mb-5 flex items-center gap-3'>
                  <div className='flex size-9 items-center justify-center rounded-lg bg-amber-500/10'>
                    <Sparkles className='size-4 text-amber-400' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-base font-semibold'>
                      Instrucciones Detalladas
                    </h2>
                    <p className='text-muted-foreground text-xs'>
                      Usa el editor para dar formato a las instrucciones
                    </p>
                  </div>
                </div>

                <RichTextEditor
                  content={instructions}
                  onChange={setInstructions}
                  placeholder='Escribe las instrucciones detalladas para la tarea...'
                  className='min-h-[280px]'
                />
              </section>

              {/* Rubric */}
              <section className='border-border/60 bg-card rounded-xl border p-6'>
                <div className='mb-5 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex size-9 items-center justify-center rounded-lg bg-emerald-500/10'>
                      <Target className='size-4 text-emerald-400' />
                    </div>
                    <div>
                      <h2 className='text-foreground text-base font-semibold'>
                        Rúbrica de Evaluación
                      </h2>
                      <p className='text-muted-foreground text-xs'>
                        Define los criterios de calificación
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={showRubric}
                    onCheckedChange={setShowRubric}
                  />
                </div>

                {showRubric && (
                  <div className='flex flex-col gap-4'>
                    {rubricCriteria.length > 0 && (
                      <div className='bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border px-3 py-2'>
                        <span className='text-muted-foreground text-sm'>
                          Total de puntos en rúbrica:
                        </span>
                        <Badge
                          variant='secondary'
                          className='bg-primary/15 text-primary'
                        >
                          {totalRubricPoints} pts
                        </Badge>
                      </div>
                    )}

                    {rubricCriteria.map((criterion, index) => (
                      <div
                        key={criterion.id}
                        className='group border-border/60 bg-secondary/20 hover:border-primary/30 rounded-xl border p-4 transition-all'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='bg-muted text-muted-foreground mt-1 flex size-8 items-center justify-center rounded-lg'>
                            <GripVertical className='size-4' />
                          </div>
                          <div className='flex flex-1 flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                              <Badge
                                variant='outline'
                                className='shrink-0 text-xs'
                              >
                                Criterio {index + 1}
                              </Badge>
                              <Input
                                placeholder='Nombre del criterio'
                                value={criterion.name}
                                onChange={(e) =>
                                  updateRubricCriterion(
                                    criterion.id,
                                    'name',
                                    e.target.value
                                  )
                                }
                                className='bg-secondary/40 border-border/60 h-9'
                              />
                              <div className='flex items-center gap-2'>
                                <Input
                                  type='number'
                                  placeholder='Pts'
                                  value={criterion.max_points}
                                  onChange={(e) =>
                                    updateRubricCriterion(
                                      criterion.id,
                                      'max_points',
                                      Number(e.target.value)
                                    )
                                  }
                                  className='bg-secondary/40 border-border/60 h-9 w-20 text-center'
                                />
                                <span className='text-muted-foreground text-xs'>
                                  pts
                                </span>
                              </div>
                            </div>
                            <Textarea
                              placeholder='Descripción del criterio...'
                              value={criterion.description}
                              onChange={(e) =>
                                updateRubricCriterion(
                                  criterion.id,
                                  'description',
                                  e.target.value
                                )
                              }
                              rows={2}
                              className='bg-secondary/40 border-border/60 resize-none text-sm'
                            />
                          </div>
                          <button
                            type='button'
                            onClick={() => removeRubricCriterion(criterion.id)}
                            className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex size-8 items-center justify-center rounded-lg transition-colors'
                          >
                            <Trash2 className='size-4' />
                          </button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type='button'
                      variant='outline'
                      onClick={addRubricCriterion}
                      className='border-border/60 hover:border-primary/50 hover:bg-primary/5 h-11 w-full gap-2 border-dashed'
                    >
                      <Plus className='size-4' />
                      Agregar criterio
                    </Button>

                    {rubricCriteria.length === 0 && (
                      <div className='bg-muted/50 text-muted-foreground flex items-center gap-3 rounded-lg px-4 py-3'>
                        <Info className='size-4 shrink-0' />
                        <span className='text-sm'>
                          Agrega criterios para definir cómo se calificará la
                          tarea
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Right column - Settings */}
            <div className='flex flex-col gap-6'>
              {/* Scoring */}
              <section className='border-border/60 bg-card rounded-xl border p-5'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex size-8 items-center justify-center rounded-lg bg-blue-500/10'>
                    <Target className='size-4 text-blue-400' />
                  </div>
                  <h3 className='text-foreground text-sm font-semibold'>
                    Puntuación
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='flex flex-col gap-1.5'>
                      <Label className='text-muted-foreground text-xs'>
                        Max puntos
                      </Label>
                      <Input
                        type='number'
                        value={maxPoints}
                        onChange={(e) => setMaxPoints(e.target.value)}
                        className='bg-secondary/40 border-border/60 h-10 text-center'
                      />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <Label className='text-muted-foreground text-xs'>
                        Min aprobatorio
                      </Label>
                      <Input
                        type='number'
                        value={passingScore}
                        onChange={(e) => setPassingScore(e.target.value)}
                        className='bg-secondary/40 border-border/60 h-10 text-center'
                      />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <Label className='text-muted-foreground text-xs'>
                        Intentos
                      </Label>
                      <Input
                        type='number'
                        min='1'
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(e.target.value)}
                        className='bg-secondary/40 border-border/60 h-10 text-center'
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Dates */}
              <section className='border-border/60 bg-card rounded-xl border p-5'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex size-8 items-center justify-center rounded-lg bg-purple-500/10'>
                    <Calendar className='size-4 text-purple-400' />
                  </div>
                  <h3 className='text-foreground text-sm font-semibold'>
                    Fechas y Plazos
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-muted-foreground text-xs'>
                      Disponible desde
                    </Label>
                    <Input
                      type='datetime-local'
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      className='bg-secondary/40 border-border/60 h-10'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-muted-foreground text-xs'>
                      Fecha límite
                    </Label>
                    <Input
                      type='datetime-local'
                      value={dueAt}
                      onChange={(e) => setDueAt(e.target.value)}
                      className='bg-secondary/40 border-border/60 h-10'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-muted-foreground text-xs'>
                      Acepta entregas hasta
                    </Label>
                    <Input
                      type='datetime-local'
                      value={lateSubmissionUntil}
                      onChange={(e) => setLateSubmissionUntil(e.target.value)}
                      className='bg-secondary/40 border-border/60 h-10'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-muted-foreground text-xs'>
                      Penalización por entrega tardía (%)
                    </Label>
                    <Input
                      type='number'
                      min='0'
                      max='100'
                      value={latePenaltyPercent}
                      onChange={(e) => setLatePenaltyPercent(e.target.value)}
                      className='bg-secondary/40 border-border/60 h-10'
                    />
                  </div>
                </div>
              </section>

              {/* Submission Settings */}
              <section className='border-border/60 bg-card rounded-xl border p-5'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex size-8 items-center justify-center rounded-lg bg-orange-500/10'>
                    <Upload className='size-4 text-orange-400' />
                  </div>
                  <h3 className='text-foreground text-sm font-semibold'>
                    Configuración de Entregas
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Respuesta de texto</Label>
                    <Switch
                      checked={requireTextSubmission}
                      onCheckedChange={setRequireTextSubmission}
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Subida de archivos</Label>
                    <Switch
                      checked={requireFileUpload}
                      onCheckedChange={setRequireFileUpload}
                    />
                  </div>

                  {requireFileUpload && (
                    <div className='border-primary/20 grid grid-cols-2 gap-3 border-l-2 pl-4'>
                      <div className='flex flex-col gap-1.5'>
                        <Label className='text-muted-foreground text-xs'>
                          Max archivos
                        </Label>
                        <Input
                          type='number'
                          min='1'
                          value={maxFileUploads}
                          onChange={(e) => setMaxFileUploads(e.target.value)}
                          className='bg-secondary/40 border-border/60 h-9 text-center'
                        />
                      </div>
                      <div className='flex flex-col gap-1.5'>
                        <Label className='text-muted-foreground text-xs'>
                          Tamaño max (MB)
                        </Label>
                        <Input
                          type='number'
                          min='1'
                          value={maxFileSizeMb}
                          onChange={(e) => setMaxFileSizeMb(e.target.value)}
                          className='bg-secondary/40 border-border/60 h-9 text-center'
                        />
                      </div>
                    </div>
                  )}

                  <div className='bg-border/60 h-px' />

                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Permitir re-envío</Label>
                    <Switch
                      checked={allowResubmission}
                      onCheckedChange={setAllowResubmission}
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Auto-aceptar a tiempo</Label>
                    <Switch
                      checked={autoAcceptOnTime}
                      onCheckedChange={setAutoAcceptOnTime}
                    />
                  </div>
                </div>
              </section>

              {/* Peer Review */}
              <section className='border-border/60 bg-card rounded-xl border p-5'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex size-8 items-center justify-center rounded-lg bg-cyan-500/10'>
                    <Users className='size-4 text-cyan-400' />
                  </div>
                  <h3 className='text-foreground text-sm font-semibold'>
                    Revisión por Pares
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>
                      Habilitar revisión por pares
                    </Label>
                    <Switch
                      checked={peerReviewEnabled}
                      onCheckedChange={setPeerReviewEnabled}
                    />
                  </div>

                  {peerReviewEnabled && (
                    <div className='border-primary/20 flex flex-col gap-1.5 border-l-2 pl-4'>
                      <Label className='text-muted-foreground text-xs'>
                        Revisiones por estudiante
                      </Label>
                      <Input
                        type='number'
                        min='1'
                        value={peerReviewCount}
                        onChange={(e) => setPeerReviewCount(e.target.value)}
                        className='bg-secondary/40 border-border/60 h-9'
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Quick tips */}
              <div className='border-primary/20 bg-primary/5 rounded-xl border p-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/15 flex size-8 shrink-0 items-center justify-center rounded-lg'>
                    <Sparkles className='text-primary size-4' />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-foreground text-sm font-medium'>
                      Consejos
                    </span>
                    <ul className='text-muted-foreground space-y-1 text-xs'>
                      <li>Define instrucciones claras y específicas</li>
                      <li>Usa la rúbrica para una calificación objetiva</li>
                      <li>
                        Considera la revisión por pares para fomentar el
                        aprendizaje
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
