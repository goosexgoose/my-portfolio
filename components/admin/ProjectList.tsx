'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { toast } from 'react-hot-toast';
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

interface ProjectListProps {
  onEditProject?: (project: Project) => void;
}

export default function ProjectList({ onEditProject }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdDesc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    setProjects(list);
    setLoading(false);
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    if (searchTerm) {
      result = result.filter(p =>
        (p.title + p.description + (p.tags || []).join(',')).toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [projects, searchTerm, filterCategory, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected projects?`)) return;

    await Promise.all(selectedIds.map(id => deleteDoc(doc(db, 'projects', id))));
    toast.success('Selected projects deleted!');
    setSelectedIds([]);
    fetchProjects();
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 顶部工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select select-bordered"
          >
            <option value="All">All Categories</option>
            <option value="Coding">Coding</option>
            <option value="Localization">Localization</option>
            <option value="Photography">Photography</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-bordered"
          >
            <option value="createdDesc">Newest</option>
            <option value="createdAsc">Oldest</option>
            <option value="titleAsc">Title A-Z</option>
            <option value="titleDesc">Title Z-A</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchDelete}
            className="btn btn-error btn-sm"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div key={p.id} className="relative border p-4 rounded-none shadow hover:shadow-md">
            {/* Checkbox 右上角 */}
            <div className="absolute top-2 right-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggleSelect(p.id)}
                className="checkbox checkbox-sm"
              />
            </div>

            <h3 className="text-lg font-bold mb-2">
              <Link
                href={`/projects/${p.category}/${p.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {p.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 capitalize">{p.category} | {p.status}</p>
            <p className="text-xs text-gray-400 mt-1">
              Created: {p.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}<br />
              Updated: {p.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {p.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-200 rounded">{tag}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <button
                onClick={() => onEditProject?.(p)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (confirm('Delete this project?')) {
                    await deleteDoc(doc(db, 'projects', p.id));
                    toast.success('Project deleted');
                    fetchProjects();
                  }
                }}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
