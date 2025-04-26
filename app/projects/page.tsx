'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';

import ProjectSidebar from '@/components/projects/ProjectSidebar';
import SidebarToggleButton from '@/components/common/SidebarToggleButton';
import FilterControls from '@/components/projects/FilterControls';
import ProjectCard from '@/components/projects/ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: 'Coding' | 'Localization' | 'Photography';
  coverUrl?: string;
  layout?: any;
  status: 'draft' | 'published';
  createdAt?: { toDate: () => Date };
}

const categories = ['Coding', 'Localization', 'Photography'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdDesc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Filter and sort projects based on category, search term, and sort order
  const filtered = useMemo(() => {
    let result = [...projects];

    if (filterCategory !== 'All') {
      result = result.filter((p) => p.category === filterCategory);
    }

    if (searchTerm) {
      result = result.filter((p) =>
        (p.title + p.description + p.tech.join(','))
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

  // Group projects into categories
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
    <div className="relative flex flex-col sm:flex-row max-w-7xl mx-auto px-4 pt-10 pb-20 gap-6">
      {/* Sidebar */}
      <ProjectSidebar categories={categories} sidebarOpen={sidebarOpen} />

      {/* Mobile Sidebar Toggle Button */}
      <SidebarToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-600">
            Browse all published projects by category with filter, sort, and search.
          </p>
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
          let list = grouped[cat];
          if (!list.length) return null;

          // Limit photography projects to 3 items
          if (cat === 'Photography') {
            list = list.slice(0, 3);
          }

          return (
            <section key={cat} id={cat.toLowerCase()} className="space-y-6">
              <h2 className="text-xl font-semibold">{cat} Projects</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {list.map((proj) => (
                  <ProjectCard key={proj.id} project={proj} />
                ))}
              </div>

              {/* Show a link to Gallery page if category is Photography */}
              {cat === 'Photography' && (
  <div className="text-center pt-8">
    <div className="inline-block bg-blue-50 px-6 py-4 rounded-xl">
      <p className="text-gray-700 text-base mb-2">
        For a full photography collection and enhanced viewing experience,
      </p>
      <Link
        href="/gallery"
        className="inline-block text-blue-600 font-semibold hover:underline hover:text-blue-700 transition"
      >
        Visit the Gallery →
      </Link>
    </div>
  </div>
)}

            </section>
          );
        })}
      </main>
    </div>
  );
}
