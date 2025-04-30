'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';

import ProjectSidebar from '@/components/projects/ProjectSidebar';
import SidebarToggleButton from '@/components/common/SidebarToggleButton';
import FilterControls from '@/components/projects/FilterControls';
import ProjectCard from '@/components/projects/ProjectCard';
import PhotographyMasonry from '@/components/gallery/PhotographyMasonry';



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

const categories = ['Coding', 'Localization', 'Photography'];
const findFirstImage = (nodes: any[]): { src: string; alt?: string } | null => {
  if (!Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (node.type === 'image' && node.attrs?.src) {
      return { src: node.attrs.src, alt: node.attrs.alt };
    }
    if (Array.isArray(node.content)) {
      const found = findFirstImage(node.content);
      if (found) return found;
    }
  }
  return null;
};


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdDesc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const baseQuery = query(collection(db, 'projects'), where('status', '==', 'published'));
      const snapshot = await getDocs(baseQuery);
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(all);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(cat.toLowerCase()));
      const scrollPosition = window.scrollY + 150;

      let current: string | null = null;

      sections.forEach((section) => {
        if (section) {
          const offsetTop = section.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = section.id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (filterCategory !== 'All') {
      result = result.filter((p) => p.category === filterCategory);
    }

    if (searchTerm) {
      result = result.filter((p) =>
        (p.title + p.description + (p.tags || []).join(','))
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'createdAsc':
        result.sort((a, b) => (new Date(a.createdAt?.toDate?.() ?? 0)).getTime() - (new Date(b.createdAt?.toDate?.() ?? 0)).getTime());
        break;
      case 'titleAsc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        result.sort((a, b) => (new Date(b.createdAt?.toDate?.() ?? 0)).getTime() - (new Date(a.createdAt?.toDate?.() ?? 0)).getTime());
    }

    return result;
  }, [projects, filterCategory, searchTerm, sortBy]);

  const grouped = useMemo(() => {
    const res: Record<string, Project[]> = {
      Coding: [],
      Localization: [],
      Photography: [],
    };
    filtered.forEach((proj) => {
      res[proj.category].push(proj);
    });
    return res;
  }, [filtered]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row max-w-7xl mx-auto px-4 pt-10 pb-20 gap-6 min-h-screen">
      <div className="hidden sm:block w-48">
        <ProjectSidebar
          categories={categories}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
        />
      </div>

      <SidebarToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-600">Browse all published projects by category with filter, sort, and search.</p>
        </div>

        <FilterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

          {categories.map((cat) => {
            const list = grouped[cat];
            if (!list.length) return null;

            if (cat === 'Photography') {
              const photos = list
                .sort((a, b) => (new Date(b.createdAt?.toDate?.() ?? 0)).getTime() - (new Date(a.createdAt?.toDate?.() ?? 0)).getTime())
                .slice(0, 9)
                .map((proj) => {
                  const layout = proj.layout?.en || proj.layout?.zh || proj.layout || null;
                  const firstImage = findFirstImage(layout?.content || []);
                  return {
                    id: proj.id,
                    src: firstImage?.src || '',
                    alt: proj.description || '',
                  };
                })
                .filter(p => p.src); 

              return (
                <section key={cat} id={cat.toLowerCase()} className="space-y-6">
                  <h2 className="text-xl font-semibold">{cat} Projects</h2>
                  <div className="border rounded-none p-4 bg-white">
                    <PhotographyMasonry photos={photos} />
                  </div>
                </section>
              );
            }

 
  return (
    <section key={cat} id={cat.toLowerCase()} className="space-y-6">
      <h2 className="text-xl font-semibold">{cat} Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </section>
  );
})}

      </main>
    </div>
  );
}
