import { JSONContent } from '@tiptap/react';

export type EditorContentType = JSONContent | string;

export interface RichTextEditorProps {
  value?: EditorContentType;
  onChange: (content: EditorContentType) => void;
  editable?: boolean;
  placeholder?: string;
}
