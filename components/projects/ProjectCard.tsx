'use client';

import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  tags?: string[];  
  category: 'Coding' | 'Localization' | 'Photography';
  coverUrl?: string;
  layout?: any;
  status: 'draft' | 'published';
  createdAt?: { toDate: () => Date };
  updatedAt?: { toDate: () => Date };  
  isRecentWork?: boolean; 
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  function getCoverImageUrl(project: Project): string | null {
    const layout = project.layout;
    try {
      const layoutObj = typeof layout === 'string' ? JSON.parse(layout) : layout;
      const doc = layoutObj?.en || layoutObj?.zh;
      if (!doc || !Array.isArray(doc.content)) return null;

      const firstImageNode = doc.content.find(
        (node: any) => node.type === 'image' && node.attrs?.src
      );
      if (firstImageNode?.attrs?.src) {
        return firstImageNode.attrs.src.startsWith('//')
          ? `https:${firstImageNode.attrs.src}`
          : firstImageNode.attrs.src;
      }
    } catch (e) {
      console.error('Error parsing layout:', e);
    }
    return project.coverUrl ?? null;
  }

  const cover = getCoverImageUrl(project);

  return (
    <div className="border rounded-lg shadow bg-white hover:shadow-lg transition-all p-4 group">
      {cover && (
        <div className="mb-3 overflow-hidden rounded">
          <img
            src={cover}
            alt={`Cover of project ${project.title}`}
            width={600}
            height={400}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{project.description}</p>
      <div className="flex flex-wrap gap-1 text-xs mb-3">
        {(project.tags || []).map((tag: string, i: number) => (
          <span key={i} className="bg-gray-100 border px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/projects/${project.id}`}
        className="text-blue-600 text-sm hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
}
