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
  const layout = project.layout || null; // ✅ Use layout directly

  // Fetch all published projects
  const allSnapshot = await adminDb.collection('projects')
    .where('status', '==', 'published')
    .orderBy('createdAt', 'asc')
    .get();

  const allProjects = allSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; title: string }[];

  // Find the index of the current project
  const currentIndex = allProjects.findIndex((p) => p.id === params.id);

  // Find the next project; if at the end, cycle back to the first
  const nextProject = currentIndex >= 0
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Top Navigation */}
      <div className="flex justify-between items-center text-sm text-gray-500 pb-4">
        <Link href="/projects" className="hover:underline">← All Projects</Link>
        {nextProject && (
          <Link href={`/projects/${nextProject.id}`} className="hover:underline">
            Next Project →
          </Link>
        )}
      </div>

      {/* Title and Description */}
      <div>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rich Text Content */}
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
