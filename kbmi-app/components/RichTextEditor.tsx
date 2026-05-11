'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold, Italic, UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, ImageIcon, Heading2,
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || 'Write something...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[120px] p-3 focus:outline-none text-gray-800',
      },
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  const addImageFromUrl = () => {
    const url = prompt('Enter image URL:')
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      alert('Only http/https URLs are allowed.')
      return
    }
    editor.chain().focus().setImage({ src: url }).run()
  }

  const addImageFromFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const src = ev.target?.result as string
        editor.chain().focus().setImage({ src }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const toolbarBtn = (active: boolean, onClick: () => void, children: React.ReactNode, title?: string) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
        active
          ? 'bg-emerald-700 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        {toolbarBtn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="h-3.5 w-3.5" />, 'Bold')}
        {toolbarBtn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-3.5 w-3.5" />, 'Italic')}
        {toolbarBtn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="h-3.5 w-3.5" />, 'Underline')}

        <div className="h-5 w-px bg-gray-200 mx-1" />

        {toolbarBtn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-3.5 w-3.5" />, 'Heading')}
        {toolbarBtn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="h-3.5 w-3.5" />, 'Bullet list')}
        {toolbarBtn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-3.5 w-3.5" />, 'Numbered list')}

        <div className="h-5 w-px bg-gray-200 mx-1" />

        {toolbarBtn(editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), <AlignLeft className="h-3.5 w-3.5" />)}
        {toolbarBtn(editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), <AlignCenter className="h-3.5 w-3.5" />)}
        {toolbarBtn(editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), <AlignRight className="h-3.5 w-3.5" />)}

        <div className="h-5 w-px bg-gray-200 mx-1" />

        {/* Image upload */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={addImageFromFile}
            title="Upload image"
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={addImageFromUrl}
            title="Image from URL"
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
