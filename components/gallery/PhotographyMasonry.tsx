'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Masonry from 'react-masonry-css';
import FloatingGalleryHint from './FloatingGalleryHint';

interface Photo {
  id: string;
  src: string;
  alt?: string;
  createdAt: number;
}

export default function PhotographyMasonry() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'published'),
        where('category', '==', 'Photography')
      );
      const snapshot = await getDocs(q);
      const allPhotos: Photo[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const layout = data.layout?.en || data.layout?.zh || null;
        const createdAt = data.createdAt?.toDate?.().getTime() || 0;

        if (layout && layout.type === 'doc' && Array.isArray(layout.content)) {
          const firstImage = findFirstImage(layout.content);
          if (firstImage) {
            allPhotos.push({
              id: firstImage.src,
              src: firstImage.src,
              alt: firstImage.alt || '',
              createdAt,
            });
          }
        }
      });

      allPhotos.sort((a, b) => b.createdAt - a.createdAt);
      setPhotos(allPhotos.slice(0, 9));
    })();
  }, []);

  const findFirstImage = (nodes: any[]): { src: string; alt?: string } | null => {
    for (const node of nodes) {
      if (node.type === 'image' && node.attrs?.src) {
        return { src: node.attrs.src, alt: node.attrs.alt };
      }
      if (node.content) {
        const found = findFirstImage(node.content);
        if (found) return found;
      }
    }
    return null;
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="relative w-full">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="masonry"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="mb-4 overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition"
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={photo.src}
              alt={photo.alt || 'Photography'}
              className="w-full h-auto rounded-lg object-contain"
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
