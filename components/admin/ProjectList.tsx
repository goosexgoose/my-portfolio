'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { toast } from 'react-hot-toast';
import ProjectEditModal from './ProjectEditModal';

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

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    setProjects(list);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'projects', id));
    toast.success('Project deleted');
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.category} | {p.status}</p>
            <p className="text-xs text-gray-400">
              Created: {p.createdAt?.toDate?.().toLocaleDateString?.()}<br />
              Updated: {p.updatedAt?.toDate?.().toLocaleDateString?.()}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {p.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-200 rounded">{tag}</span>
              ))}
            </div>
            <div className="flex gap-3 mt-3 text-sm">
              <button onClick={() => setEditingProject(p)} className="text-blue-600 underline">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-600 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <ProjectEditModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSaveSuccess={() => {
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}
