'use client';

import Image from 'next/image';
import Link from 'next/link';

function getFirstImageFromLayout(layout: any): string | null {
  if (!layout) return null;
  const doc = layout?.en || layout?.zh;
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return null;

  const firstImageNode = doc.content.find(
    (node: any) => node.type === 'image' && node.attrs?.src
  );
  const src = firstImageNode?.attrs?.src;
  return src?.startsWith('//') ? `https:${src}` : src || null;
}

export default function ProjectCard({ project }: { project: any }) {
  const cover = getFirstImageFromLayout(project.layout) || project.coverUrl;

  return (
    <div className="border rounded-lg shadow bg-white hover:shadow-lg transition-all p-4 group">
      {cover && (
        <div className="mb-3 overflow-hidden rounded">
          <Image
            src={cover}
            alt={project.title}
            width={600}
            height={400}
            className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{project.description}</p>
      <div className="flex flex-wrap gap-1 text-xs mb-3">
        {project.tech.map((tag: string, idx: number) => (
          <span key={idx} className="bg-gray-100 border px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/projects/${project.id}`} className="text-blue-600 text-sm hover:underline">
        View Details →
      </Link>
    </div>
  );
}
