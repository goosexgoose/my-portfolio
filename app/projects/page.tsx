'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

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

  useEffect(() => {
    (async () => {
      const baseQuery = query(
        collection(db, 'projects'),
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(baseQuery);
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(all);
    })();
  }, []);

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

  function formatUrl(url: string | undefined | null): string | null {
    if (!url) return null;
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  }

  function getFirstImageFromLayout(layout: any): string | null {
    try {
      if (!layout) return null;
  
      
      const layoutObj = typeof layout === 'string' ? JSON.parse(layout) : layout;
  
      
      const doc = layoutObj?.en || layoutObj?.zh;
      if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return null;
  
    
      const firstImageNode = doc.content.find(
        (node: any) => node.type === 'image' && node.attrs?.src
      );
  
      if (!firstImageNode) {
        console.warn('No image node found in layout:', layoutObj);
        return null;
      }
  
      const src = firstImageNode.attrs.src;
      if (!src) return null;
  
    
      return src.startsWith('//') ? `https:${src}` : src;
    } catch (error) {
      console.error('Error parsing layout or extracting image:', error);
      return null;
    }
  }
  

  return (
    <div className="relative flex flex-col sm:flex-row max-w-7xl mx-auto px-4 pt-10 pb-20 gap-6">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col gap-4 text-sm text-gray-700 font-medium pt-2 mt-55 sticky top-30 w-40">
        <div className="sticky top-20 text-sm space-y-4">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="block text-gray-700 hover:text-black hover:underline transition"
            >
              {cat}
            </a>
          ))}
        </div>
      </aside>

      {/* Sidebar Toggle for Mobile */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="sm:hidden fixed bottom-4 left-4 z-50 bg-black text-white rounded-full p-2 shadow-lg"
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Main Content */}
      <main className="flex-1 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-600">
            Browse all published projects by category with filter, sort, and search.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="createdDesc">Created: Newest First</option>
            <option value="createdAsc">Created: Oldest First</option>
            <option value="titleAsc">Title: A–Z</option>
            <option value="titleDesc">Title: Z–A</option>
          </select>
        </div>

        {/* Grouped Projects */}
        {categories.map((cat) => {
          const list = grouped[cat];
          if (!list?.length) return null;

          return (
            <section key={cat} id={cat.toLowerCase()} className="space-y-6">
              <h2 className="text-xl font-semibold">{cat} Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {list.map((p) => {
                  const firstImage = getFirstImageFromLayout(p.layout);
                  const cover = firstImage || (p.coverUrl ? formatUrl(p.coverUrl) : null);

                  console.log('Project:', p.title, 'Cover:', cover);

                  return (
                    <div
                      key={p.id}
                      className="border rounded-lg shadow bg-white hover:shadow-lg transition-all p-4 group"
                    >
                      {cover && (
                        <div className="mb-3 overflow-hidden rounded">
                          <Image
                            src={cover}
                            alt={p.title}
                            width={600}
                            height={400}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1 text-xs mb-3">
                        {p.tech.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 border px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/projects/${p.id}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {!filtered.length && (
          <p className="text-gray-500 text-center py-20">No projects found.</p>
        )}
      </main>
    </div>
  );
}
