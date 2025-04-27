'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Masonry from 'react-masonry-css';
import Link from 'next/link';
import LoginOverlay from '@/components/auth/LoginOverlay';

interface PhotoItem {
  id: string;
  src: string;
  alt?: string;
}

export default function GalleryPage() {
  const [recentWorks, setRecentWorks] = useState<PhotoItem[]>([]);
  const [allWorks, setAllWorks] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { email: firebaseUser.email || undefined } : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'published'),
        where('category', '==', 'Photography')
      );
      const snapshot = await getDocs(q);
      const recent: PhotoItem[] = [];
      const all: PhotoItem[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const layout = data.layout?.en || data.layout?.zh || data.layout || null;

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
    <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-20 space-y-16">
      
      {/* Top Intro */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Photography Gallery</h1>
        <p className="text-gray-500 text-sm">Recent Works are public. Full archive available after login.</p>
      </div>

      {/* Personal Intro Section */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center text-gray-700">
        <div className="w-full md:w-1/2">
          <img
            src="/pics/IMG_1415.jpeg"
            alt="Kaiya's film camera"
            className="rounded-none shadow-md object-cover w-full"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4 text-base">
          <p>
            I am passionate about walking the streets to capture the daily lives of ordinary people,
            but I also love landscapes and architecture. The charm of photography lies in capturing
            emotions within fleeting moments — a beautiful invention.
          </p>
          <p>
            I especially love film cameras for their unique textures. My favorite gears are Ricoh GR2
            and Canon Prima Super 90 Wide.
          </p>
        </div>
      </div>

      {/* Recent Works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Recent Works</h2>
        {recentWorks.length > 0 ? (
          <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-4" columnClassName="masonry-column">
            {recentWorks.map((photo) => (
              <Link
                key={photo.id}
                href={`/projects/Photography/${photo.id}`}
                className="block overflow-hidden rounded-none hover:opacity-90 transition"
              >
                <img
                  src={photo.src}
                  alt={photo.alt || 'Photography'}
                  className="w-full h-auto object-cover rounded-none"
                />
              </Link>
            ))}
          </Masonry>
        ) : (
          <p className="text-gray-400 text-center">No recent works available.</p>
        )}
      </section>

      {/* All Works */}
      <section className="relative space-y-6">
        <h2 className="text-2xl font-semibold">All Works</h2>
        {user ? (
          allWorks.length > 0 ? (
            <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-6" columnClassName="masonry-column">
              {allWorks.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/projects/Photography/${photo.id}`}
                  className="block overflow-hidden rounded-none hover:opacity-90 transition"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt || 'Photography'}
                    className="w-full h-auto object-cover rounded-none mb-6"
                  />
                </Link>
              ))}
            </Masonry>
          ) : (
            <p className="text-gray-400 text-center">No works found.</p>
          )
        ) : (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <LoginOverlay />
          </div>
        )}
      </section>

    </div>
  );
}
