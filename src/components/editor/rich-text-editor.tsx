import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Minus,
  Code2,
  RemoveFormatting,
} from 'lucide-react'
import { useState, useCallback } from 'react'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex items-center justify-center size-8 rounded-md transition-all duration-200',
        'hover:bg-primary/10 hover:text-primary',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        isActive &&
          'bg-primary/15 text-primary shadow-[0_0_8px_rgba(99,102,241,0.15)]'
      )}
    >
      {children}
    </button>
  )
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const setLink = useCallback(() => {
    if (!editor || !linkUrl) return
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setLinkUrl('')
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return
    editor.chain().focus().setImage({ src: imageUrl }).run()
    setImageUrl('')
  }, [editor, imageUrl])

  if (!editor) return null

  return (
    <div className='flex items-center gap-0.5 flex-wrap p-2 border-b border-border/60 bg-secondary/20 rounded-t-lg'>
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title='Deshacer'
      >
        <Undo className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title='Rehacer'
      >
        <Redo className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title='Titulo 1'
      >
        <Heading1 className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title='Titulo 2'
      >
        <Heading2 className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title='Titulo 3'
      >
        <Heading3 className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title='Negrita'
      >
        <Bold className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title='Cursiva'
      >
        <Italic className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title='Subrayado'
      >
        <UnderlineIcon className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title='Tachado'
      >
        <Strikethrough className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        title='Resaltado'
      >
        <Highlighter className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title='Lista de puntos'
      >
        <List className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title='Lista numerada'
      >
        <ListOrdered className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title='Alinear izquierda'
      >
        <AlignLeft className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title='Alinear centro'
      >
        <AlignCenter className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title='Alinear derecha'
      >
        <AlignRight className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title='Cita'
      >
        <Quote className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title='Codigo inline'
      >
        <Code className='size-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title='Bloque de codigo'
      >
        <Code2 className='size-4' />
      </ToolbarButton>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <Popover>
        <PopoverTrigger asChild>
          <button
            type='button'
            className={cn(
              'flex items-center justify-center size-8 rounded-md transition-all duration-200',
              'hover:bg-primary/10 hover:text-primary',
              editor.isActive('link') && 'bg-primary/15 text-primary'
            )}
            title='Enlace'
          >
            <LinkIcon className='size-4' />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='w-80 p-3 bg-card border-border/60'
          align='start'
        >
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-medium text-muted-foreground'>
              URL del enlace
            </label>
            <div className='flex gap-2'>
              <Input
                type='url'
                placeholder='https://ejemplo.com'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className='h-8 text-sm bg-secondary/40'
              />
              <Button size='sm' onClick={setLink} className='h-8 px-3'>
                Aplicar
              </Button>
            </div>
            {editor.isActive('link') && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().unsetLink().run()}
                className='text-xs h-7'
              >
                Quitar enlace
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type='button'
            className={cn(
              'flex items-center justify-center size-8 rounded-md transition-all duration-200',
              'hover:bg-primary/10 hover:text-primary'
            )}
            title='Imagen'
          >
            <ImageIcon className='size-4' />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='w-80 p-3 bg-card border-border/60'
          align='start'
        >
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-medium text-muted-foreground'>
              URL de la imagen
            </label>
            <div className='flex gap-2'>
              <Input
                type='url'
                placeholder='https://ejemplo.com/imagen.jpg'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className='h-8 text-sm bg-secondary/40'
              />
              <Button size='sm' onClick={addImage} className='h-8 px-3'>
                Insertar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation='vertical' className='h-6 mx-1 bg-border/60' />

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title='Linea divisoria'
      >
        <Minus className='size-4' />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        title='Limpiar formato'
      >
        <RemoveFormatting className='size-4' />
      </ToolbarButton>
    </div>
  )
}

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Escribe el contenido de tu leccion...',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto mx-auto my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
          class: 'bg-primary/20 text-foreground px-1 rounded',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none min-h-[400px] px-4 py-3 focus:outline-none',
          'dark:prose-invert',
          'prose-headings:text-foreground prose-headings:font-semibold',
          'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
          'prose-p:text-foreground/90 prose-p:leading-relaxed',
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-ul:text-foreground/90 prose-ol:text-foreground/90',
          'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic',
          'prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
          'prose-pre:bg-secondary/60 prose-pre:border prose-pre:border-border/40',
          'prose-hr:border-border/60'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div
      className={cn(
        'rounded-lg border border-border/60 bg-card overflow-hidden',
        'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40',
        'transition-all duration-300',
        className
      )}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export { useEditor, type Editor }
