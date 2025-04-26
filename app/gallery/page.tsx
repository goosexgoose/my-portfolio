'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import GallerySection from '@/components/gallery/GallerySection';
import LoginOverlay from '@/components/auth/LoginOverlay';

interface GalleryProject {
  id: string;
  title: string;
  description: string;
  layout: any;
  deviceTags?: string[];
  isRecentWork?: boolean;
  status: 'published' | 'draft';
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [user, setUser] = useState<{ displayName?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? {
        displayName: firebaseUser.displayName || undefined,
        email: firebaseUser.email || undefined,
      } : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, 'projects'), where('category', '==', 'Photography'), where('status', '==', 'published'));
        const snapshot = await getDocs(q);
        const loaded: GalleryProject[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as GalleryProject[];
        setProjects(loaded);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recentWorks = projects.filter(p => p.isRecentWork);
  const allWorks = projects.filter(p => !p.isRecentWork);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading gallery...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-20">
      <h1 className="text-4xl font-bold text-center mb-12">Photography Gallery</h1>

      {/* Recent Works */}
      <GallerySection title="Recent Works" projects={recentWorks} />

      {/* All Works */}
      <div className="relative">
        {!user && <LoginOverlay />}
        <GallerySection title="All Works" projects={user ? allWorks : []} blurred={!user} />
      </div>
    </div>
  );
}
