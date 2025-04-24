'use client';

import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Code, Quote, List, ListOrdered,
  Undo, Redo, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';
import clsx from 'clsx';

export default function Toolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append('folder', 'portfolio/editor-images');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      editor.chain().focus().setImage({ src: data.secure_url }).run();
    };
    input.click();
  };

  const insertLink = () => {
    const url = window.prompt('Enter link');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex gap-2 flex-wrap px-4 py-2 bg-gray-100 border-b text-gray-700 text-sm">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={clsx(editor.isActive('bold') && 'font-bold')}> <Bold size={16} /> </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={clsx(editor.isActive('italic') && 'italic')}> <Italic size={16} /> </button>
      <button onClick={() => editor.chain().focus().toggleCode().run()}> <Code size={16} /> </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()}> <Quote size={16} /> </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}> <List size={16} /> </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}> <ListOrdered size={16} /> </button>
      <button onClick={insertLink}> <LinkIcon size={16} /> </button>
      <button onClick={insertImage}> <ImageIcon size={16} /> </button>
      <button onClick={() => editor.chain().focus().undo().run()}> <Undo size={16} /> </button>
      <button onClick={() => editor.chain().focus().redo().run()}> <Redo size={16} /> </button>
    </div>
  );
}
