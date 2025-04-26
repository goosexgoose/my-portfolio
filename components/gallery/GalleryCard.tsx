'use client';

import Link from 'next/link';
import Image from 'next/image';

function getFirstImageFromLayout(layout: any): string | null {
  if (!layout) return null;
  const doc = layout?.en || layout?.zh;
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return null;
  const imgNode = doc.content.find((node: any) => node.type === 'image' && node.attrs?.src);
  return imgNode?.attrs?.src || null;
}

export default function GalleryCard({ project }: { project: any }) {
  const cover = getFirstImageFromLayout(project.layout);

  return (
    <Link href={`/gallery/${project.id}`}>
      <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition group">
        {cover ? (
          <div className="relative w-full h-60 overflow-hidden">
            <Image
              src={cover}
              alt={project.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-60 bg-gray-100 text-gray-400">No Image</div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{project.description}</p>
        </div>
      </div>
    </Link>
  );
}
