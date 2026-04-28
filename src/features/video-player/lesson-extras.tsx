import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentService } from '@/services/comment-service'
import type { LessonAttachment, LessonComment } from '@/types'
import {
  Download,
  ExternalLink,
  MessageCircle,
  Paperclip,
  Send,
  Loader2,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return 'ahora'
  if (diffMins < 60) return `hace ${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `hace ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `hace ${diffDays} d`
  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

// ─── ResourceItem ─────────────────────────────────────────────────────────────

function ResourceItem({ attachment }: { attachment: LessonAttachment }) {
  const iconMap: Record<string, string> = {
    'file-pdf': '📄',
    'file-archive': '🗜️',
    'file-excel': '📊',
    'file-powerpoint': '📑',
    'file-word': '📝',
    'file-image': '🖼️',
    'file-video': '🎬',
    'file-audio': '🎵',
    'file-code': '💻',
    file: '📎',
  }
  const icon = iconMap[attachment.file_icon] ?? '📎'
  const fileSizeMb = Number(attachment.file_size_mb)
  const hasFileSize = Number.isFinite(fileSizeMb) && fileSizeMb > 0

  return (
    <div className='bg-secondary/30 hover:bg-secondary/50 flex items-center gap-3 rounded-lg p-3 transition-colors'>
      <div className='bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg text-xl'>
        {icon}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-foreground truncate text-sm font-medium'>
          {attachment.title}
        </p>
        <p className='text-muted-foreground text-xs capitalize'>
          {attachment.attachment_type}
          {attachment.file_extension && ` · .${attachment.file_extension}`}
          {hasFileSize ? ` · ${fileSizeMb.toFixed(1)} MB` : ''}
          {attachment.required && (
            <span className='ml-1 text-amber-400'>· Requerido</span>
          )}
        </p>
      </div>
      {attachment.download_url ? (
        attachment.attachment_kind === 'url' ? (
          <a
            href={attachment.download_url}
            target='_blank'
            rel='noopener noreferrer'
            className='shrink-0'
          >
            <Button variant='outline' size='sm' className='gap-1.5'>
              <ExternalLink className='size-3.5' />
              Abrir
            </Button>
          </a>
        ) : (
          <a
            href={attachment.download_url}
            download
            target='_blank'
            rel='noopener noreferrer'
            className='shrink-0'
          >
            <Button variant='outline' size='sm' className='gap-1.5'>
              <Download className='size-3.5' />
              Descargar
            </Button>
          </a>
        )
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='shrink-0 gap-1.5 opacity-50'
        >
          No disponible
        </Button>
      )}
    </div>
  )
}

// ─── CommentItem ──────────────────────────────────────────────────────────────

function CommentItem({
  comment,
  lessonId,
  onRefresh,
}: {
  comment: LessonComment
  lessonId: number
  onRefresh: () => void
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const user = useAuthStore((s) => s.user)

  const replyMutation = useMutation({
    mutationFn: () =>
      commentService.createLessonComment(lessonId, replyBody, comment.id),
    onSuccess: () => {
      setReplyBody('')
      setShowReply(false)
      onRefresh()
    },
    onError: () => toast.error('No se pudo enviar la respuesta'),
  })

  const name = comment.user?.full_name ?? 'Usuario'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div id={`comment-${comment.id}`} className='flex gap-3'>
      <Avatar className='mt-0.5 size-8 shrink-0'>
        <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
      </Avatar>
      <div className='min-w-0 flex-1'>
        <div className='mb-1 flex items-baseline gap-2'>
          <span className='text-foreground text-sm font-medium'>{name}</span>
          <span className='text-muted-foreground text-xs'>
            {formatRelativeDate(comment.created_at)}
          </span>
          {comment.edited && (
            <span className='text-muted-foreground text-xs'>(editado)</span>
          )}
        </div>
        <div
          className='prose prose-invert prose-sm text-foreground/90 max-w-none text-sm'
          dangerouslySetInnerHTML={{
            __html: comment.body_html || comment.body,
          }}
        />
        <div className='mt-1.5 flex items-center gap-3'>
          {user && (
            <button
              onClick={() => setShowReply((v) => !v)}
              className='text-muted-foreground hover:text-foreground text-xs transition-colors'
            >
              Responder
            </button>
          )}
          {comment.replies_count > 0 && (
            <span className='text-muted-foreground text-xs'>
              {comment.replies_count} respuesta
              {comment.replies_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {showReply && user && (
          <div className='mt-3 flex gap-2'>
            <Textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder='Escribe una respuesta...'
              rows={2}
              className='resize-none text-sm'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  if (replyBody.trim()) replyMutation.mutate()
                }
              }}
            />
            <Button
              size='sm'
              onClick={() => replyMutation.mutate()}
              disabled={!replyBody.trim() || replyMutation.isPending}
              className='shrink-0 self-end'
            >
              {replyMutation.isPending ? (
                <Loader2 className='size-3.5 animate-spin' />
              ) : (
                <Send className='size-3.5' />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── LessonExtras ─────────────────────────────────────────────────────────────

export function LessonExtras({
  lessonId,
  attachments,
}: {
  lessonId: number
  attachments?: LessonAttachment[]
}) {
  const [commentBody, setCommentBody] = useState('')
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['lesson-comments', lessonId],
    queryFn: () => commentService.getLessonComments(lessonId),
  })
  const comments = data?.comments ?? []

  const createMutation = useMutation({
    mutationFn: () => commentService.createLessonComment(lessonId, commentBody),
    onSuccess: () => {
      setCommentBody('')
      queryClient.invalidateQueries({ queryKey: ['lesson-comments', lessonId] })
    },
    onError: () => toast.error('No se pudo publicar el comentario'),
  })

  const refreshComments = () =>
    queryClient.invalidateQueries({ queryKey: ['lesson-comments', lessonId] })

  const resourceCount = attachments?.length ?? 0

  return (
    <div className='bg-card border-border mt-0 overflow-hidden rounded-xl border'>
      <Tabs defaultValue='comments'>
        <TabsList
          className={cn(
            'border-border bg-secondary/20 h-12 w-full justify-start rounded-none border-b px-2'
          )}
        >
          <TabsTrigger value='resources' className='gap-2 text-sm'>
            <Paperclip className='size-4' />
            Recursos
            {resourceCount > 0 && (
              <span className='bg-primary/20 text-primary ml-1 rounded-full px-1.5 py-0.5 text-xs'>
                {resourceCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='comments' className='gap-2 text-sm'>
            <MessageCircle className='size-4' />
            Comentarios
            {comments.length > 0 && (
              <span className='bg-primary/20 text-primary ml-1 rounded-full px-1.5 py-0.5 text-xs'>
                {comments.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Resources ── */}
        <TabsContent value='resources' className='p-4'>
          {resourceCount === 0 ? (
            <div className='text-muted-foreground flex flex-col items-center justify-center py-10'>
              <FileText className='mb-2 size-10 opacity-30' />
              <p className='text-sm'>No hay recursos para esta lección</p>
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              {attachments!.map((att) => (
                <ResourceItem key={att.id} attachment={att} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Comments ── */}
        <TabsContent value='comments' className='p-4'>
          {/* New comment form */}
          {user && (
            <div className='mb-6 flex gap-3'>
              <Avatar className='mt-1 size-8 shrink-0'>
                <AvatarImage src={user.avatar_url ?? undefined} />
                <AvatarFallback className='text-xs'>
                  {(
                    user.first_name?.[0] ??
                    user.email?.[0] ??
                    '?'
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <Textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder='Escribe un comentario o pregunta... (Ctrl+Enter para enviar)'
                  rows={3}
                  className='mb-2 resize-none text-sm'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      if (commentBody.trim()) createMutation.mutate()
                    }
                  }}
                />
                <div className='flex justify-end'>
                  <Button
                    size='sm'
                    onClick={() => createMutation.mutate()}
                    disabled={!commentBody.trim() || createMutation.isPending}
                    className='gap-1.5'
                  >
                    {createMutation.isPending ? (
                      <Loader2 className='size-3.5 animate-spin' />
                    ) : (
                      <Send className='size-3.5' />
                    )}
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments list */}
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='text-muted-foreground size-6 animate-spin' />
            </div>
          ) : comments.length === 0 ? (
            <div className='text-muted-foreground flex flex-col items-center justify-center py-10'>
              <MessageCircle className='mb-2 size-10 opacity-30' />
              <p className='text-sm'>
                {user
                  ? 'Sé el primero en comentar'
                  : 'Inicia sesión para comentar'}
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-5'>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  lessonId={lessonId}
                  onRefresh={refreshComments}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
