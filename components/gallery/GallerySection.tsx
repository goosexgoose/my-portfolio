'use client';

import GalleryCard from './GalleryCard';


interface GalleryProject {
  id: string;
  title: string;
  description: string;
  layout: any;
  deviceTags?: string[];  // 
  isRecentWork?: boolean;
  status: 'published' | 'draft';
}

interface Props {
  title: string;
  projects: GalleryProject[];
  blurred?: boolean;
}

export default function GallerySection({ title, projects }: Props) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <GalleryCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
