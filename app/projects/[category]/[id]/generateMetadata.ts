// app/projects/[category]/[id]/generateMetadata.ts

import { adminDb } from '@/lib/firebaseAdmin';
import type { Metadata } from 'next';

interface Props {
  params: {
    category: string;
    id: string;
  };
}

// 注意：async function 名字必须是 generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;

  // 从 Firestore 查这个 id 的项目
  const snapshot = await adminDb.collection('projects').doc(id).get();

  if (!snapshot.exists) {
    return {
      title: 'Project Not Found | Portfolio',
      description: 'This project does not exist or has been deleted.',
    };
  }

  const data = snapshot.data();

  return {
    title: `${data?.title ?? 'Untitled Project'} | Portfolio`,
    description: data?.description ?? 'A project from my portfolio showcasing development and creative work.',
    openGraph: {
      title: data?.title ?? 'Untitled Project',
      description: data?.description ?? 'A project from my portfolio showcasing development and creative work.',
      type: 'website',
      url: `/projects/${params.category}/${id}`,
    },
  };
}
