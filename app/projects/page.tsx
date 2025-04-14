'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: 'Coding' | 'Localization' | 'Photography';
  coverUrl?: string;
  status: 'draft' | 'published';
  createdAt?: { toDate: () => Date };
}

const PAGE_SIZE = 6; // how many projects per page load

export default function ProjectsPage() {
  // State for storing and loading projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // State for filtering/search/sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdDesc'); // 'createdDesc' | 'createdAsc' | 'titleAsc' | 'titleDesc'

  // Fetch the initial page whenever sort changes
  useEffect(() => {
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Build base query according to sort condition
  function buildBaseQuery() {
    let base = query(collection(db, 'projects'), where('status', '==', 'published'));

    switch (sortBy) {
      case 'titleAsc':
        base = query(base, orderBy('title', 'asc'));
        break;
      case 'titleDesc':
        base = query(base, orderBy('title', 'desc'));
        break;
      case 'createdAsc':
        base = query(base, orderBy('createdAt', 'asc'));
        break;
      default:
        // createdDesc
        base = query(base, orderBy('createdAt', 'desc'));
        break;
    }
    return base;
  }

  async function fetchInitial() {
    setLoading(true);
    setHasMore(true);
    setProjects([]);
    setLastDoc(null);

    const base = buildBaseQuery();
    const snapshot = await getDocs(query(base, limit(PAGE_SIZE)));
    processSnapshot(snapshot, true);
    setLoading(false);
  }

  async function loadMore() {
    if (!lastDoc || !hasMore) return;
    setLoading(true);

    const base = buildBaseQuery();
    const snapshot = await getDocs(query(base, limit(PAGE_SIZE), startAfter(lastDoc)));
    processSnapshot(snapshot);
    setLoading(false);
  }

  function processSnapshot(snapshot: any, reset = false) {
    if (!snapshot.empty) {
      const items = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setProjects(prev => reset ? items : [...prev, ...items]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      if (snapshot.docs.length < PAGE_SIZE) setHasMore(false);
    } else {
      setHasMore(false);
    }
  }

  // Filter + Search
  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchCat = filterCategory === 'All' || p.category === filterCategory;
      const combined = (p.title + p.description + p.tech.join(',')).toLowerCase();
      const matchSearch = combined.includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [projects, filterCategory, searchTerm]);

  // Group by categories for sectioning
  const grouped = useMemo(() => {
    const res: Record<string, Project[]> = {
      Coding: [],
      Localization: [],
      Photography: [],
    };
    filtered.forEach(proj => {
      res[proj.category].push(proj);
    });
    return res;
  }, [filtered]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>
      <p className="text-gray-600 mb-6">
        Explore my published projects with sorting, filtering, and pagination.
      </p>

      {/* Search + Filter + Sort */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        />

        {/* Filter Category */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Coding">Coding</option>
          <option value="Localization">Localization</option>
          <option value="Photography">Photography</option>
        </select>

        {/* Sort By */}
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

      {/* Category anchor links */}
      <div className="flex gap-4 text-sm text-blue-600 mb-8">
        <a href="#coding" className="hover:underline">#Coding</a>
        <a href="#localization" className="hover:underline">#Localization</a>
        <a href="#photography" className="hover:underline">#Photography</a>
      </div>

      {/* Loading skeleton if initial data is still fetching */}
      {loading && projects.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-60 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      )}

      {/* Display grouped categories */}
      {['Coding', 'Localization', 'Photography'].map(cat => {
        const items = grouped[cat];
        if (!items || !items.length) return null;

        return (
          <div key={cat} id={cat.toLowerCase()} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{cat} Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-lg shadow hover:shadow-lg transition p-3 group bg-white"
                >
                  {p.coverUrl && (
                    <div className="overflow-hidden rounded cursor-pointer mb-3 group-hover:opacity-90">
                      <Image
                        src={p.coverUrl}
                        alt={p.title}
                        width={600}
                        height={400}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold line-clamp-1 mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1 text-xs mb-3">
                    {p.tech.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 border rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${p.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* No results message */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 py-20">No projects found.</p>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
