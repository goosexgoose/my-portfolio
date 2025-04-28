import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebaseAdmin';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PhotographyDetailClient from '@/components/projects/PhotographyDetailClient';
import NormalDetailClient from '@/components/projects/NormalDetailClient';



export default async function ProjectDetailPage(props: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await props.params;

  const docRef = adminDb.collection('projects').doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists || snapshot.data()?.status !== 'published') {
    return notFound();
  }

  const project = snapshot.data()!;
  const layout = project.layout?.en || project.layout?.zh || project.layout || null;
  const isPhotography = project.category === 'Photography';

  const allProjectsSnap = await adminDb.collection('projects')
    .where('status', '==', 'published')
    .where('category', '==', project.category)
    .get();

  const allProjects = allProjectsSnap.docs.map(doc => ({ id: doc.id }));
  const currentIndex = allProjects.findIndex(p => p.id === id);

  const nextProject = allProjects.length > 0
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : null;

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Top Nav */}
      <div className="flex justify-between items-center text-sm text-gray-500 pb-2">
        <Link href={isPhotography ? '/gallery' : '/projects'} className="hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> {isPhotography ? 'Back to Gallery' : 'Back to Projects'}
        </Link>

        {nextProject && (
          <Link href={`/projects/${project.category}/${nextProject.id}`} className="flex items-center gap-1 text-blue-600 hover:underline">
            Next <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Title + Desc */}
      <div className={`space-y-4 ${isPhotography ? 'text-center' : 'text-left'}`}>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.description && (
          <p className="text-gray-600">{project.description}</p>
        )}
      </div>

      {/* Content */}
      {isPhotography ? (
        <PhotographyDetailClient layout={layout} />
      ) : (
        <NormalDetailClient layout={layout} />
      )}
    </div>
  );
}
