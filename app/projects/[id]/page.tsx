import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebaseAdmin';
import RichContentViewer from '@/components/editor/RichContentViewer';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: Props) {
  const docRef = adminDb.collection('projects').doc(params.id);
  const snapshot = await docRef.get();

  if (!snapshot.exists || snapshot.data()?.status !== 'published') {
    return notFound();
  }

  const project = snapshot.data()!;
  const layout = project.layout?.en || project.layout?.zh || null; 

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Navigation */}
      <div className="flex justify-between items-center text-sm text-gray-500 pb-4">
        <Link href="/" className="hover:underline">← Home</Link>
        <Link href="/projects" className="hover:underline">All Projects →</Link>
      </div>

      {/* Cover Image */}
      {project.coverUrl && (
        <img
          src={project.coverUrl}
          alt="project cover"
          className="w-full max-h-[400px] object-contain rounded-lg shadow"
        />
      )}

      {/* Title + Description */}
      <div>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
      </div>

      {/* Rich Content Viewer */}
      {layout && (
        <div className="prose max-w-none">
          <RichContentViewer content={layout} />
        </div>
      )}

      {/* Timestamps */}
      {(project.createdAt || project.updatedAt) && (
        <div className="pt-8 text-xs text-gray-500 border-t space-y-1">
          {project.createdAt?.toDate && (
            <p>First Published: {project.createdAt.toDate().toLocaleString()}</p>
          )}
          {project.updatedAt?.toDate && (
            <p>Last Updated: {project.updatedAt.toDate().toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
