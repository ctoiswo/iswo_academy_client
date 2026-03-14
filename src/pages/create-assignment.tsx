import { useState, useEffect } from 'react'
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
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCreateAssignment } from '@/hooks/use-assignments'
import { useSections } from '@/hooks/use-sections'
import { useLessons } from '@/hooks/use-lessons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    <div className='min-h-screen flex flex-col bg-background relative'>
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
        className='pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-15 blur-[140px] rounded-full bg-primary'
        aria-hidden='true'
      />

      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl'>
        <div className='max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={() =>
                navigate({
                  to: '/academy/$academySlug/courses/$courseSlug/assignments',
                  params: { academySlug, courseSlug },
                })
              }
              className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='size-4' />
              <span className='hidden sm:inline'>Volver</span>
            </button>
            <div className='h-6 w-px bg-border hidden sm:block' />
            <div className='flex flex-col'>
              <span className='text-xs text-muted-foreground'>{courseSlug}</span>
              <span className='text-sm font-medium text-foreground'>
                Nueva Tarea
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 text-muted-foreground'
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
                <div className='size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin' />
              ) : (
                <Save className='size-4' />
              )}
              <span className='hidden sm:inline'>Guardar tarea</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 lg:px-8 py-8'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          {/* Page header */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center size-12 rounded-xl bg-primary/10 border border-primary/20'>
                <ClipboardList className='size-6 text-primary' />
              </div>
              <div>
                <h1 className='text-2xl font-bold tracking-tight text-foreground'>
                  Crear Nueva Tarea
                </h1>
                <p className='text-sm text-muted-foreground'>
                  Configura una tarea para evaluar a los estudiantes
                </p>
              </div>
            </div>
          </div>

          {/* Two column layout */}
          <div className='grid lg:grid-cols-[1fr,380px] gap-8'>
            {/* Left column */}
            <div className='flex flex-col gap-6'>
              {/* Basic Info */}
              <section className='rounded-xl border border-border/60 bg-card p-6'>
                <div className='flex items-center gap-3 mb-5'>
                  <div className='flex items-center justify-center size-9 rounded-lg bg-primary/10'>
                    <FileText className='size-4 text-primary' />
                  </div>
                  <h2 className='text-base font-semibold text-foreground'>
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
                      className='h-11 bg-secondary/40 border-border/60 focus:border-primary/50'
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

                  <div className='grid sm:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-2'>
                      <Label className='text-sm font-medium'>Sección</Label>
                      <Select
                        value={selectedSectionId}
                        onValueChange={setSelectedSectionId}
                      >
                        <SelectTrigger className='h-11 bg-secondary/40 border-border/60'>
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
                        <SelectTrigger className='h-11 bg-secondary/40 border-border/60'>
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
              <section className='rounded-xl border border-border/60 bg-card p-6'>
                <div className='flex items-center gap-3 mb-5'>
                  <div className='flex items-center justify-center size-9 rounded-lg bg-amber-500/10'>
                    <Sparkles className='size-4 text-amber-400' />
                  </div>
                  <div>
                    <h2 className='text-base font-semibold text-foreground'>
                      Instrucciones Detalladas
                    </h2>
                    <p className='text-xs text-muted-foreground'>
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
              <section className='rounded-xl border border-border/60 bg-card p-6'>
                <div className='flex items-center justify-between mb-5'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center size-9 rounded-lg bg-emerald-500/10'>
                      <Target className='size-4 text-emerald-400' />
                    </div>
                    <div>
                      <h2 className='text-base font-semibold text-foreground'>
                        Rúbrica de Evaluación
                      </h2>
                      <p className='text-xs text-muted-foreground'>
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
                      <div className='flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/20'>
                        <span className='text-sm text-muted-foreground'>
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
                        className='group rounded-xl border border-border/60 bg-secondary/20 p-4 transition-all hover:border-primary/30'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='flex items-center justify-center size-8 rounded-lg bg-muted text-muted-foreground mt-1'>
                            <GripVertical className='size-4' />
                          </div>
                          <div className='flex-1 flex flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                              <Badge
                                variant='outline'
                                className='text-xs shrink-0'
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
                                className='h-9 bg-secondary/40 border-border/60'
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
                                  className='h-9 w-20 bg-secondary/40 border-border/60 text-center'
                                />
                                <span className='text-xs text-muted-foreground'>
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
                            className='flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
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
                      className='w-full gap-2 h-11 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5'
                    >
                      <Plus className='size-4' />
                      Agregar criterio
                    </Button>

                    {rubricCriteria.length === 0 && (
                      <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 text-muted-foreground'>
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
              <section className='rounded-xl border border-border/60 bg-card p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center size-8 rounded-lg bg-blue-500/10'>
                    <Target className='size-4 text-blue-400' />
                  </div>
                  <h3 className='text-sm font-semibold text-foreground'>
                    Puntuación
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='flex flex-col gap-1.5'>
                      <Label className='text-xs text-muted-foreground'>
                        Max puntos
                      </Label>
                      <Input
                        type='number'
                        value={maxPoints}
                        onChange={(e) => setMaxPoints(e.target.value)}
                        className='h-10 bg-secondary/40 border-border/60 text-center'
                      />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <Label className='text-xs text-muted-foreground'>
                        Min aprobatorio
                      </Label>
                      <Input
                        type='number'
                        value={passingScore}
                        onChange={(e) => setPassingScore(e.target.value)}
                        className='h-10 bg-secondary/40 border-border/60 text-center'
                      />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <Label className='text-xs text-muted-foreground'>
                        Intentos
                      </Label>
                      <Input
                        type='number'
                        min='1'
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(e.target.value)}
                        className='h-10 bg-secondary/40 border-border/60 text-center'
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Dates */}
              <section className='rounded-xl border border-border/60 bg-card p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center size-8 rounded-lg bg-purple-500/10'>
                    <Calendar className='size-4 text-purple-400' />
                  </div>
                  <h3 className='text-sm font-semibold text-foreground'>
                    Fechas y Plazos
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs text-muted-foreground'>
                      Disponible desde
                    </Label>
                    <Input
                      type='datetime-local'
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      className='h-10 bg-secondary/40 border-border/60'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs text-muted-foreground'>
                      Fecha límite
                    </Label>
                    <Input
                      type='datetime-local'
                      value={dueAt}
                      onChange={(e) => setDueAt(e.target.value)}
                      className='h-10 bg-secondary/40 border-border/60'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs text-muted-foreground'>
                      Acepta entregas hasta
                    </Label>
                    <Input
                      type='datetime-local'
                      value={lateSubmissionUntil}
                      onChange={(e) => setLateSubmissionUntil(e.target.value)}
                      className='h-10 bg-secondary/40 border-border/60'
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <Label className='text-xs text-muted-foreground'>
                      Penalización por entrega tardía (%)
                    </Label>
                    <Input
                      type='number'
                      min='0'
                      max='100'
                      value={latePenaltyPercent}
                      onChange={(e) => setLatePenaltyPercent(e.target.value)}
                      className='h-10 bg-secondary/40 border-border/60'
                    />
                  </div>
                </div>
              </section>

              {/* Submission Settings */}
              <section className='rounded-xl border border-border/60 bg-card p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center size-8 rounded-lg bg-orange-500/10'>
                    <Upload className='size-4 text-orange-400' />
                  </div>
                  <h3 className='text-sm font-semibold text-foreground'>
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
                    <div className='grid grid-cols-2 gap-3 pl-4 border-l-2 border-primary/20'>
                      <div className='flex flex-col gap-1.5'>
                        <Label className='text-xs text-muted-foreground'>
                          Max archivos
                        </Label>
                        <Input
                          type='number'
                          min='1'
                          value={maxFileUploads}
                          onChange={(e) => setMaxFileUploads(e.target.value)}
                          className='h-9 bg-secondary/40 border-border/60 text-center'
                        />
                      </div>
                      <div className='flex flex-col gap-1.5'>
                        <Label className='text-xs text-muted-foreground'>
                          Tamaño max (MB)
                        </Label>
                        <Input
                          type='number'
                          min='1'
                          value={maxFileSizeMb}
                          onChange={(e) => setMaxFileSizeMb(e.target.value)}
                          className='h-9 bg-secondary/40 border-border/60 text-center'
                        />
                      </div>
                    </div>
                  )}

                  <div className='h-px bg-border/60' />

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
              <section className='rounded-xl border border-border/60 bg-card p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center size-8 rounded-lg bg-cyan-500/10'>
                    <Users className='size-4 text-cyan-400' />
                  </div>
                  <h3 className='text-sm font-semibold text-foreground'>
                    Revisión por Pares
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Habilitar revisión por pares</Label>
                    <Switch
                      checked={peerReviewEnabled}
                      onCheckedChange={setPeerReviewEnabled}
                    />
                  </div>

                  {peerReviewEnabled && (
                    <div className='flex flex-col gap-1.5 pl-4 border-l-2 border-primary/20'>
                      <Label className='text-xs text-muted-foreground'>
                        Revisiones por estudiante
                      </Label>
                      <Input
                        type='number'
                        min='1'
                        value={peerReviewCount}
                        onChange={(e) => setPeerReviewCount(e.target.value)}
                        className='h-9 bg-secondary/40 border-border/60'
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Quick tips */}
              <div className='rounded-xl border border-primary/20 bg-primary/5 p-4'>
                <div className='flex items-start gap-3'>
                  <div className='flex items-center justify-center size-8 rounded-lg bg-primary/15 shrink-0'>
                    <Sparkles className='size-4 text-primary' />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium text-foreground'>
                      Consejos
                    </span>
                    <ul className='text-xs text-muted-foreground space-y-1'>
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
