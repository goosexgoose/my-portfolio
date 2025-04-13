import ReadingProgressBar from '@/components/ReadingProgressBar';
import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebaseAdmin';
import type { Metadata } from 'next';
import Link from 'next/link';

// --- 🧠 Metadata for SEO ---
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const snapshot = await adminDb.collection('projects').doc(params.id).get();
  if (!snapshot.exists) return {};
  const data = snapshot.data();
  return {
    title: `${data?.title ?? 'Untitled'} | Portfolio`,
    description: data?.description ?? 'A project from my portfolio',
  };
}

// --- 📄 Project Detail Page ---
export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const docRef = adminDb.collection('projects').doc(params.id);
  const snapshot = await docRef.get();

  if (!snapshot.exists || snapshot.data()?.status !== 'published') {
    return notFound();
  }

  const project = snapshot.data()!;
  const layout = typeof project.layout === 'string' ? JSON.parse(project.layout) : project.layout;

  // --- ⬅️➡️ Previous / Next Projects ---
  const allPublished = await adminDb
    .collection('projects')
    .where('status', '==', 'published')
    .orderBy('createdAt', 'asc')
    .get();

  const projectList = allPublished.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    ...doc.data(),
  }));

  const currentIndex = projectList.findIndex((p) => p.id === params.id);
  const prevProject = projectList[currentIndex - 1];
  const nextProject = projectList[currentIndex + 1];

  return (
    <>
      {/* 📊 Scroll Progress */}
      <ReadingProgressBar />

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        {/* 🔙 Navigation */}
        <div className="flex justify-between items-center text-sm text-gray-500 pb-4">
          <Link href="/" className="hover:underline">← Home</Link>
          <Link href="/projects" className="hover:underline">All Projects →</Link>
        </div>

        {/* 🖼️ Cover Image */}
        {project.coverUrl && (
          <img
            src={project.coverUrl}
            alt="project cover"
            className="w-full max-h-[400px] object-cover rounded-lg shadow"
          />
        )}

        {/* 📌 Title + Description */}
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>

        {/* 📐 Custom Layout Content */}
        <div className="space-y-6">
          {layout?.map((block: any, index: number) => {
            switch (block.type) {
              case 'heading':
                return <h2 key={index} className="text-2xl font-semibold">{block.content}</h2>;
              case 'text':
                return <p key={index} className="text-base whitespace-pre-wrap leading-relaxed">{block.content}</p>;
              case 'quote':
                return <blockquote key={index} className="border-l-4 border-yellow-400 pl-4 italic text-gray-700">{block.content}</blockquote>;
              case 'code':
                return (
                  <pre key={index} className="bg-gray-100 text-sm p-4 rounded overflow-auto">
                    <code>{block.content}</code>
                  </pre>
                );
              case 'image':
                return <img key={index} src={block.url} alt="project-img" className="w-full rounded" />;
              case 'video':
                return <video key={index} src={block.url} controls className="w-full rounded" />;
              default:
                return null;
            }
          })}
        </div>

        {/* 🕒 Timestamps */}
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

        {/* ⬅️➡️ Previous / Next */}
        <div className="flex justify-between pt-10 border-t text-sm text-blue-600">
          {prevProject ? (
            <Link href={`/projects/${prevProject.id}`} className="hover:underline">
              ← {prevProject.title}
            </Link>
          ) : <div />}
          {nextProject ? (
            <Link href={`/projects/${nextProject.id}`} className="hover:underline">
              {nextProject.title} →
            </Link>
          ) : <div />}
        </div>
      </div>
    </>
  );
}
