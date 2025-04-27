'use client';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContentType } from '@/types/editor';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import Youtube from '@tiptap/extension-youtube';

export default function useRichTextEditor({
  value,
  onChange,
  editable = true,
  placeholder = 'Write here...',
}: {
  value?: EditorContentType;
  onChange: (json: EditorContentType) => void;
  editable?: boolean;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'mx-auto my-4 rounded',
          HTMLAttributes: {
            class: 'youtube-video',
            frameborder: '0',
          },
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: true }),
    ],
    content: value || '',
    editable,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find((item) => item.type.includes('image'))?.getAsFile();
        if (file) {
          event.preventDefault();
          handleImageUpload(file);
        }
        return false;
      },
      handleDrop(view, event) {
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
          event.preventDefault();
          handleImageUpload(file);
        }
        return false;
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor) return;
    try {
      const url = await uploadToCloudinary(file, 'portfolio/editor-images');
      editor.chain().focus().setImage({ src: url }).run();
      onChange(editor.getJSON());
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  return { editor };
}
