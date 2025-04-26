'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Masonry from 'react-masonry-css';
import Link from 'next/link';

interface PhotoItem {
  id: string;
  src: string;
  alt?: string;
}

export default function GalleryPage() {
  const [recentWorks, setRecentWorks] = useState<PhotoItem[]>([]);
  const [allWorks, setAllWorks] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const baseQuery = query(
        collection(db, 'projects'),
        where('status', '==', 'published'),
        where('category', '==', 'Photography'),
      );
      const snapshot = await getDocs(baseQuery);
      const recent: PhotoItem[] = [];
      const all: PhotoItem[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const layout = data.layout?.en || data.layout?.zh || null;
        if (!layout || !Array.isArray(layout.content)) return;

        const firstImage = findFirstImage(layout.content);
        if (!firstImage) return;

        const photoItem: PhotoItem = {
          id: doc.id,
          src: firstImage.src,
          alt: data.description || '',
        };

        all.push(photoItem);
        if (data.isRecentWork) {
          recent.push(photoItem);
        }
      });

      setRecentWorks(recent);
      setAllWorks(all);
      setLoading(false);
    })();
  }, []);

  const findFirstImage = (nodes: any[]): { src: string; alt?: string } | null => {
    for (const node of nodes) {
      if (node.type === 'image' && node.attrs?.src) {
        return { src: node.attrs.src, alt: node.attrs.alt };
      }
      if (Array.isArray(node.content)) {
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

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading gallery...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-20 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Photography Gallery</h1>
        <p className="text-gray-500 text-sm">
          Recent Works are open to public. Full archive available after login.
        </p>
      </div>

      {/* Recent Works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Works</h2>
        {recentWorks.length > 0 ? (
          <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-4" columnClassName="masonry-column">
            {recentWorks.map((photo) => (
              <Link key={photo.id} href={`/gallery/${photo.id}`} className="group block overflow-hidden rounded-lg hover:opacity-90 transition">
                <img
                  src={photo.src}
                  alt={photo.alt || 'Photography'}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </Link>
            ))}
          </Masonry>
        ) : (
          <p className="text-gray-400 text-center">No recent works available.</p>
        )}
      </section>

      {/* All Works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Works</h2>
        {allWorks.length > 0 ? (
          <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-6" columnClassName="masonry-column">
          {allWorks.map((photo) => (
            <div key={photo.id} className="mb-6">
              <Link href={`/gallery/${photo.id}`} className="group block overflow-hidden rounded-lg hover:opacity-90 transition">
                <img
                  src={photo.src}
                  alt={photo.alt || 'Photography'}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </Link>
            </div>
          ))}
        </Masonry>
        
        ) : (
          <p className="text-gray-400 text-center">No works found.</p>
        )}
      </section>
    </div>
  );
}
