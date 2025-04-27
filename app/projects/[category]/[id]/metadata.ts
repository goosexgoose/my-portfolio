import { adminDb } from '@/lib/firebaseAdmin';
import type { Metadata } from 'next';

interface Props {
  params: { category: string; id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;

  const snapshot = await adminDb.collection('projects').doc(id).get();
  if (!snapshot.exists) return {};

  const data = snapshot.data();

  return {
    title: `${data?.title ?? 'Untitled'} | Portfolio`,
    description: data?.description ?? 'A project from my portfolio',
  };
}
