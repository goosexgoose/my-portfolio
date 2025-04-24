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
  const [mode, setMode] = useState<'editor' | 'json' | 'html'>('editor');

  useEffect(() => {
    if (editor) setShowToolbar(true);
  }, [editor]);

  const getPreviewContent = () => {
    if (!editor) return '';
    return mode === 'json'
      ? JSON.stringify(editor.getJSON(), null, 2)
      : editor.getHTML();
  };

  return (
    <div className="border rounded overflow-hidden bg-white shadow">
      {showToolbar && editor && <Toolbar editor={editor} />}

      <div className="flex justify-end px-4 py-1 border-b text-sm text-gray-600">
        <button onClick={() => setMode('editor')} className={mode === 'editor' ? 'font-bold' : ''}>Editor</button>
        <button onClick={() => setMode('json')} className={mode === 'json' ? 'font-bold ml-3' : 'ml-3'}>JSON</button>
        <button onClick={() => setMode('html')} className={mode === 'html' ? 'font-bold ml-3' : 'ml-3'}>HTML</button>
      </div>

      {mode === 'editor' && (
        <div className="p-4 prose max-w-none min-h-[200px]">
          <EditorContent editor={editor} />
        </div>
      )}

      {mode !== 'editor' && (
        <pre className="bg-gray-100 p-4 overflow-auto text-sm whitespace-pre-wrap text-gray-800">
          {getPreviewContent()}
        </pre>
      )}
    </div>
  );
}
