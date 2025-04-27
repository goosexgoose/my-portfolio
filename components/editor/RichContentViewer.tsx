'use client';

import { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

interface MySlide {
  src: string;
  title?: string;
}

export default function RichContentViewer({ content }: { content: any }) {
  console.log('RichContentViewer received content:', content);

  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<MySlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            loading: { default: 'lazy' },
            onclick: { default: null },
          };
        },
        renderHTML({ node, HTMLAttributes }) {
          const { src, alt } = node.attrs;
          return [
            'figure',
            { style: 'text-align: center; margin: 2rem 0;' },
            [
              'img',
              {
                ...HTMLAttributes,
                src,
                alt,
                style: 'cursor: zoom-in; max-width: 100%; height: auto; border-radius: 8px;',
                onclick: 'window.handleImageClick(event)',
              },
            ],
            alt
              ? ['figcaption', { style: 'color: gray; font-size: 0.9rem; margin-top: 0.5rem;' }, alt]
              : '',
          ];
        },
      }),
      Link,
      Youtube.configure({
        width: 640,
        height: 360,
        allowFullscreen: true,
        HTMLAttributes: {
          class: 'youtube-video',
          frameborder: '0',
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    editable: false,
    content,
  });

  const handleImageClickFromDom = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLImageElement;
    if (target.tagName !== 'IMG') return;

    const allImages = Array.from(document.querySelectorAll('.tiptap img')) as HTMLImageElement[];
    const slidesList: MySlide[] = allImages.map((img) => ({
      src: img.getAttribute('src') || '',
      title: img.getAttribute('alt') || '',
    }));

    const clickedSrc = target.getAttribute('src');
    const index = slidesList.findIndex((slide) => slide.src === clickedSrc);

    if (index === -1) return;

    setSlides(slidesList);
    setCurrentIndex(index);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).handleImageClick = handleImageClickFromDom;
    }
  }, [handleImageClickFromDom]);

  if (!editor) return null;

  return (
    <div className="prose max-w-none tiptap">
      <EditorContent editor={editor} />

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Zoom]}
        index={currentIndex}
        carousel={{ finite: false }}
        controller={{ closeOnPullDown: true }}
        render={{
          slide: ({ slide }) => {
            const customSlide = slide as MySlide;
            return (
              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <img
                  src={customSlide.src}
                  alt={customSlide.title || ''}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    cursor: 'zoom-out',
                  }}
                />
                {customSlide.title && (
                  <div className="text-white text-sm mt-2 text-center">
                    {customSlide.title}
                  </div>
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
}
