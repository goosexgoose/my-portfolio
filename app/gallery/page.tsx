'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Masonry from 'react-masonry-css';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import LoginOverlay from '@/components/auth/LoginOverlay'; // ✅ 记得引入

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
    <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-20 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Photography Gallery</h1>
       
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row items-start gap-8">
        {/* 左边图片 */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img
            src="/pics/IMG_1415.jpeg"
            alt="Kaiya's film camera"
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>

        {/* 右边文字 */}
        <div className="w-full md:w-1/2 space-y-4 text-gray-700">
          <p>
            I am passionate about walking the streets to capture the daily lives of ordinary people, but I also love the landscape and architecture.
            I think the charm of photography is to capture the moment, and the emotion within. Every moment is frozen in a photograph, what a beautiful invention.
            I particularly like film cameras and the unique texture it brings.
          </p>
          <p>
            The cameras I use most often are a Ricoh GR2 and a Canon Prima Super 90 Wide.
          </p>
        </div>
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
      <section className="relative space-y-4">
        <h2 className="text-2xl font-semibold">All Works</h2>
        {user ? (
          allWorks.length > 0 ? (
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
