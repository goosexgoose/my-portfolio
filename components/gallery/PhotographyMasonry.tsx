'use client';

import { useState } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import FloatingGalleryHint from './FloatingGalleryHint';

interface PhotoItem {
  id: string;
  src: string;
  alt?: string;
  
}

interface PhotographyMasonryProps {
  photos: PhotoItem[];
}

export default function PhotographyMasonry({ photos }: PhotographyMasonryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (!photos.length) {
    return <div className="text-center text-gray-400">No photos to display.</div>;
  }

  return (
    <div className="relative w-full">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-6" // 注意 gap
        columnClassName="masonry-column"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="mb-6 overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-transform transform hover:scale-105 duration-300"
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={photo.src}
              alt={photo.alt || 'Photography'}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        ))}
      </Masonry>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={photos.map((p) => ({ src: p.src, title: p.alt }))}
      />

      <FloatingGalleryHint />
    </div>
  );
}
