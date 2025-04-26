'use client';

import 'yet-another-react-lightbox/styles.css';

import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { useState } from 'react';

interface Image {
  src: string;
  title?: string;
}

interface Props {
  images: Image[];
  singleMode?: boolean; 
}

export default function GalleryLightbox({ images, singleMode = false }: Props) {
  const [open, setOpen] = useState(false);

  if (singleMode && images.length === 1) {
    const image = images[0];
    return (
      <>
        <div className="flex justify-center">
          <img
            src={image.src}
            alt={image.title || ''}
            className="rounded-lg shadow-md cursor-zoom-in"
            style={{
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
            onClick={() => setOpen(true)}
          />
        </div>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={images}
          plugins={[Zoom]}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.src}
            alt={img.title || ''}
            className="rounded-lg shadow-md cursor-zoom-in"
            onClick={() => setOpen(true)}
          />
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        plugins={[Zoom]}
      />
    </>
  );
}
