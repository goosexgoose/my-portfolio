'use client';

import { useState } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Photo {
  src: string;
  title?: string;
}

interface Props {
  layout: any;
}

export default function PhotographyDetailClient({ layout }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photos = extractImagesFromLayout(layout);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!photos.length) return null;

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div>
      {photos.length === 1 ? (
        // 如果只有一张照片，居中放大展示
        <div className="flex justify-center">
          <img
            src={photos[0].src}
            alt={photos[0].title || ''}
            onClick={() => openLightbox(0)}
            className="rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 max-w-3xl w-full object-cover"
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
          />
        </div>
      ) : (
        // 多张图走 Masonry
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="masonry-column"
        >
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="mb-4 overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(idx)}
            >
              <img
                src={photo.src}
                alt={photo.title || ''}
                className="w-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </Masonry>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={photos.map((p) => ({ src: p.src, title: p.title }))}
      />
    </div>
  );
}

function extractImagesFromLayout(layout: any): Photo[] {
  const result: Photo[] = [];
  const doc = layout?.en || layout?.zh || layout;
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return [];

  function traverse(nodes: any[]) {
    nodes.forEach((node) => {
      if (node.type === 'image' && node.attrs?.src) {
        result.push({
          src: node.attrs.src,
          title: node.attrs.alt || undefined,
        });
      }
      if (Array.isArray(node.content)) {
        traverse(node.content);
      }
    });
  }

  traverse(doc.content);
  return result;
}
