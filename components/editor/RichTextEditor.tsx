'use client';

import { useEffect, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import useRichTextEditor from '@/hooks/useRichTextEditor';
import { RichTextEditorProps } from '@/types/editor';
import Toolbar from './Toolbar';

export default function RichTextEditor({
  value,
  onChange,
  editable = true,
  placeholder = 'Write something...',
}: RichTextEditorProps) {
  const { editor } = useRichTextEditor({ value, onChange, editable, placeholder });
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    if (editor) setShowToolbar(true);

    // ➡️ 监听 editor 更新，强制保存 JSON
    if (editor) {
      editor.on('update', () => {
        onChange(editor.getJSON());
      });
    }
  }, [editor, onChange]);

  if (!editor) return null;

  return (
    <div className="border rounded overflow-hidden bg-white shadow">
      {showToolbar && editor && <Toolbar editor={editor} />}
      <div className="p-4 prose max-w-none min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
