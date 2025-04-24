'use client';

import { useEffect, useMemo, useState } from 'react';
import { Timestamp, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import AdminCVUploader from '@/components/AdminCVUploader';
import Modal from '@/components/Modal';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'react-hot-toast';

interface Project {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  category: 'Coding' | 'Localization' | 'Photography';
  github?: string;
  demo?: string;
  coverUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status?: 'published' | 'draft';
  layout?: {
    [lang: string]: any;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [layoutContent, setLayoutContent] = useState<{ [lang: string]: any }>({});
  const [lang, setLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        layout: typeof data.layout === 'string' ? JSON.parse(data.layout) : data.layout,
      } as Project;
    });
    setProjects(list);
  };

  const saveProject = async (status: 'draft' | 'published') => {
    if (!editingProject) return;

    const required = editingProject.title?.trim() && editingProject.description?.trim();
    if (status === 'published' && !required) {
      return toast.error('Title and description required.');
    }

    let coverUrl = editingProject.coverUrl ?? '';
    if (coverFile) {
      coverUrl = await uploadToCloudinary(coverFile, 'portfolio/covers');
    }

    const payload: Project = {
      ...editingProject,
      coverUrl,
      layout: {
        ...editingProject.layout,
        [lang]: layoutContent[lang]
      },
      updatedAt: Timestamp.now(),
      status,
    };

    const docRef = editingProject.id
      ? doc(db, 'projects', editingProject.id)
      : doc(collection(db, 'projects'));

    await setDoc(docRef, {
      ...payload,
      layout: JSON.stringify(payload.layout),
    }, { merge: true });

    toast.success(editingProject.id ? 'Updated' : 'Created');
    setEditingProject(null);
    setCoverFile(null);
    fetchProjects();
  };

  const filteredProjects = useMemo(() => projects, [projects]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setEditingProject({ title: '', description: '', tech: [], category: 'Coding', status: 'draft', layout: {} })}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Project
        </button>
        <AdminCVUploader />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(p => (
          <div key={p.id} className="bg-white p-4 border rounded shadow hover:shadow-md transition">
            <a
              href={`/projects/${p.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold mb-1 text-blue-700 hover:underline"
            >
              {p.title}
            </a>
            <p className="text-sm text-gray-600">{p.category}</p>
            <p className="text-xs text-gray-500">Updated: {p.updatedAt?.toDate().toLocaleString()}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <button
                onClick={() => {
                  setEditingProject(p);
                  setLayoutContent(p.layout || {});
                }}
                className="text-blue-600 underline"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  const confirmed = confirm(`Are you sure you want to delete "${p.title}"?`);
                  if (!confirmed) return;
                  await deleteDoc(doc(db, 'projects', p.id!));
                  toast.success('Project deleted');
                  fetchProjects();
                }}
                className="text-red-600 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
        {editingProject && (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Project Title"
              value={editingProject.title}
              onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Short description"
              value={editingProject.description}
              onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
            />
            <select
              value={editingProject.category}
              onChange={e => setEditingProject({ ...editingProject, category: e.target.value as Project['category'] })}
              className="w-full border p-2 rounded"
            >
              <option value="Coding">Coding</option>
              <option value="Localization">Game Localization</option>
              <option value="Photography">Photography</option>
            </select>

            <div className="border rounded p-2">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">📝 Rich Content</h4>
                <select value={lang} onChange={e => setLang(e.target.value as 'en' | 'zh')} className="text-sm border px-2 py-1 rounded">
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <RichTextEditor
                key={lang}
                value={layoutContent[lang]}
                onChange={(json) => {
                  setLayoutContent(prev => ({ ...prev, [lang]: json }));
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setEditingProject(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={() => saveProject('draft')} className="px-4 py-2 bg-gray-600 text-white rounded">Save Draft</button>
              <button onClick={() => saveProject('published')} className="px-4 py-2 bg-black text-white rounded">Publish</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
