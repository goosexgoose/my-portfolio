import { adminDb } from '@/lib/firebaseAdmin';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const snapshot = await adminDb.collection('projects').doc(params.id).get();
  if (!snapshot.exists) return {};
  const data = snapshot.data();
  return {
    title: `${data?.title ?? 'Untitled'} | Portfolio`,
    description: data?.description ?? 'A project from my portfolio',
  };
}