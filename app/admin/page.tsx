'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseClient';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, Timestamp,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import {
  DndContext, closestCenter,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Modal from '../components/Modal';

function SortableBlock({
  id,
  children,
}: {
  id: string | number;
  children: (props: { dragListeners: any }) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ dragListeners: listeners })}
    </div>
  );
}


type Block =
  | { type: 'text' | 'heading' | 'quote' | 'code'; content: string }
  | { type: 'image' | 'video'; url: string };

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
  status?: 'published' | 'draft' | 'deleted';
  statusUpdatedAt?: Timestamp;
  images?: string[];
  videos?: string[];
  layout?: Block[];
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [layoutBlocks, setLayoutBlocks] = useState<Block[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        layout: typeof data.layout === 'string' ? JSON.parse(data.layout) : data.layout,
      };
    }) as Project[];
    setProjects(list);
  };

  const saveProject = async (status: 'draft' | 'published') => {
    if (!editingProject) return;

    if (status === 'published') {
      const required = editingProject.title?.trim() && editingProject.description?.trim();
      if (!required) {
        toast.error('Please fill in title and description to publish.');
        return;
      }
    }

    let coverUrl = editingProject.coverUrl ?? '';
    if (coverFile) coverUrl = await uploadToCloudinary(coverFile, 'portfolio/covers');

    const projectData: Project = {
      ...editingProject,
      coverUrl,
      layout: layoutBlocks,
      status,
      statusUpdatedAt: Timestamp.now(),
    };

    const plainProjectData = { ...projectData, layout: JSON.stringify(projectData.layout) };

    if (editingProject.id) {
      await updateDoc(doc(db, 'projects', editingProject.id), plainProjectData);
      toast.success('Project updated');
    } else {
      await addDoc(collection(db, 'projects'), {
        ...plainProjectData,
        createdAt: Timestamp.now(),
      });
      toast.success('Project added');
    }

    setEditingProject(null);
    setCoverFile(null);
    setLayoutBlocks([]);
    fetchProjects();
  };

  const handleAddLayoutBlock = async (type: Block['type']) => {
    if (['text', 'heading', 'quote', 'code'].includes(type)) {
      setLayoutBlocks(prev => [...prev, { type, content: '' } as Block]);
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === 'image' ? 'image/*' : 'video/*';
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadToCloudinary(file, 'portfolio/layouts');
        setLayoutBlocks(prev => [...prev, { type, url } as Block]);
      };
      input.click();
    }
  };

  const updateTextBlock = (index: number, content: string) => {
    setLayoutBlocks(prev => {
      const updated = [...prev];
      if ('content' in updated[index]) {
        updated[index] = { ...updated[index], content };
      }
      return updated;
    });
  };

  const removeLayoutBlock = (index: number) => {
    setLayoutBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(active.id);
    const newIndex = parseInt(over.id);
    setLayoutBlocks(blocks => arrayMove(blocks, oldIndex, newIndex));
  };

  useEffect(() => {
    if (editingProject?.layout) setLayoutBlocks(editingProject.layout);
    else setLayoutBlocks([]);
  }, [editingProject]);

  const toggleSelect = (id: string) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const all = projects.map(p => p.id!).filter(Boolean);
    const allSelected = all.every(id => selectedProjects.includes(id));
    setSelectedProjects(allSelected ? [] : all);
  };

  const deleteSelected = async () => {
    if (!selectedProjects.length) return;
    if (!confirm('Delete selected projects?')) return;
    await Promise.all(selectedProjects.map(id => deleteDoc(doc(db, 'projects', id))));
    toast.success('Deleted selected');
    setSelectedProjects([]);
    fetchProjects();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setEditingProject({ title: '', description: '', tech: [], category: 'Coding', status: 'draft' })}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >+ Add Project</button>

        <div className="flex gap-3">
          <button onClick={selectAll} className="px-4 py-2 border text-sm">
            {selectedProjects.length === projects.length ? 'Unselect All' : 'Select All'}
          </button>
          <button
            onClick={deleteSelected}
            disabled={!selectedProjects.length}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm"
          >Delete Selected</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <div key={project.id} className="border p-4 rounded bg-white relative">
            <input
              type="checkbox"
              checked={selectedProjects.includes(project.id!)}
              onChange={() => toggleSelect(project.id!)}
              className="absolute top-3 left-3"
            />
            <h3 className="text-lg font-semibold pl-6">
              {project.status === 'published' ? (
                <a href={`/projects/${project.id}`} className="text-blue-600 underline">{project.title}</a>
              ) : project.title}
            </h3>
            <p className="text-sm text-gray-600 pl-6">
              {project.status} — {typeof project.statusUpdatedAt?.toDate === 'function'
                ? project.statusUpdatedAt.toDate().toLocaleString()
                : 'N/A'}
            </p>
            <div className="flex gap-2 mt-2 pl-6">
              <button onClick={() => setEditingProject(project)} className="text-blue-600 underline">Edit</button>
              <button
                onClick={async () => {
                  await deleteDoc(doc(db, 'projects', project.id!));
                  fetchProjects();
                }}
                className="text-red-500 underline"
              >Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
  {editingProject && (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={editingProject.title || ''}
        onChange={(e) =>
          setEditingProject({ ...editingProject, title: e.target.value })
        }
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={editingProject.description || ''}
        onChange={(e) =>
          setEditingProject({ ...editingProject, description: e.target.value })
        }
        className="w-full border p-2 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      <div className="space-y-2">
        <h4 className="text-md font-medium">📐 Project Layout</h4>
        <div className="flex gap-2 flex-wrap">
          {['text', 'heading', 'quote', 'code', 'image', 'video'].map((type) => (
            <button
              key={type}
              onClick={() => handleAddLayoutBlock(type as Block['type'])}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              + {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={layoutBlocks.map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 mt-2">
              {layoutBlocks.map((block, index) => (
                <SortableBlock key={index} id={index}>
                {({ dragListeners }) => (
                  <div
                    className={`p-3 border rounded relative shadow-sm transition-transform duration-200 ease-in-out hover:shadow-md ${
                      block.type === 'text'
                        ? 'bg-white'
                        : block.type === 'heading'
                        ? 'bg-blue-50'
                        : block.type === 'quote'
                        ? 'bg-yellow-50'
                        : block.type === 'code'
                        ? 'bg-gray-100'
                        : block.type === 'image'
                        ? 'bg-green-50'
                        : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-600">
                      <span className="flex items-center gap-2">
                        {block.type === 'text' && '📝 TEXT'}
                        {block.type === 'heading' && '🔠 HEADING'}
                        {block.type === 'quote' && '💬 QUOTE'}
                        {block.type === 'code' && '⌨️ CODE'}
                        {block.type === 'image' && '🖼️ IMAGE'}
                        {block.type === 'video' && '🎥 VIDEO'}
                      </span>
                      <span {...dragListeners} className="cursor-grab text-gray-400">
                        ↕
                      </span>
                    </div>
              
                    {['text', 'heading', 'quote', 'code'].includes(block.type) &&
                      'content' in block && (
                        <textarea
                          placeholder={`Write ${block.type} here...`}
                          value={block.content}
                          onChange={(e) => updateTextBlock(index, e.target.value)}
                          className="w-full border p-2 rounded text-sm font-mono"
                        />
                      )}
              
                    {block.type === 'image' && 'url' in block && (
                      <img src={block.url} alt="layout-img" className="w-full rounded" />
                    )}
              
                    {block.type === 'video' && 'url' in block && (
                      <video src={block.url} controls className="w-full rounded" />
                    )}
              
                    <button
                      type="button"
                      onClick={() => removeLayoutBlock(index)}
                      className="absolute top-2 right-2 text-xl font-bold text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </SortableBlock>
              
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => saveProject('draft')}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Save Draft
        </button>
        <button
          onClick={() => saveProject('published')}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Publish
        </button>
      </div>
    </div>
  )}
</Modal>

    </div>
  );
}
