'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebaseClient';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, Timestamp,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import {
  DndContext, closestCenter,
DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Modal from '@/components/Modal';

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
  | { type: 'image' | 'video' | 'pdf'; url: string };


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
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (editingProject?.layout) setLayoutBlocks(editingProject.layout);
    else setLayoutBlocks([]);
  }, [editingProject]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
      }
    };
  
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      let parsedLayout = [];
  
      try {
        parsedLayout = typeof data.layout === 'string' ? JSON.parse(data.layout) : data.layout || [];
      } catch (e) {
        console.warn('Layout parsing error for project:', doc.id);
      }
  
      return {
        id: doc.id,
        ...data,
        layout: parsedLayout,
      };
    }) as Project[];
  
    setProjects(list);
  };
  

  const saveProject = async (status: 'draft' | 'published') => {
    if (!editingProject) return;

    if (status === 'published') {
      const required = editingProject.title?.trim() && editingProject.description?.trim();
      if (!required) return toast.error('Please fill in title and description to publish.');
    }

    let coverUrl = editingProject.coverUrl ?? '';
    if (coverFile) coverUrl = await uploadToCloudinary(coverFile, 'portfolio/covers');

    const projectData: Project = {
      ...editingProject,
      coverUrl,
      layout: layoutBlocks,
      updatedAt: Timestamp.now(),
      status,
      statusUpdatedAt: Timestamp.now(),
    };

    const plainData = { ...projectData, layout: JSON.stringify(projectData.layout) };

    if (editingProject.id) {
      await updateDoc(doc(db, 'projects', editingProject.id), plainData);
      toast.success('Project updated');
    } else {
      await addDoc(collection(db, 'projects'), {
        ...plainData,
        createdAt: Timestamp.now(),
      });
      toast.success('Project added');
    }

    setEditingProject(null);
    setCoverFile(null);
    setLayoutBlocks([]);
    fetchProjects();
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCat = filterCategory === 'All' || p.category === filterCategory;
      const matchStat = filterStatus === 'All' || p.status === filterStatus;
      return matchCat && matchStat;
    });
  }, [projects, filterCategory, filterStatus]);

  const toggleSelect = (id: string) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = async () => {
    if (!selectedProjects.length) return;
    if (!confirm('Delete selected projects?')) return;
    await Promise.all(selectedProjects.map(id => deleteDoc(doc(db, 'projects', id))));
    toast.success('Deleted selected');
    setSelectedProjects([]);
    fetchProjects();
  };

  function handleAddLayoutBlock(type: Block['type']) {
    if (['text', 'heading', 'quote', 'code'].includes(type)) {
      setLayoutBlocks((prev) => [...prev, { type, content: '' } as Block]);
    } else {
      const input = document.createElement('input');
      if (type === 'pdf') {
        input.accept = 'application/pdf';
      } else {
        input.accept = type === 'image' ? 'image/*' : 'video/*';
      }
      input.type = 'file';
  
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
  
        try {
          const url = await uploadToCloudinary(file, 'portfolio/layouts');
          setLayoutBlocks((prev) => [...prev, { type, url } as Block]);
        } catch (err) {
          toast.error('Upload failed');
        }
      };
  
      input.click();
    }
  }
  
  
  
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setLayoutBlocks((prev) => {
        const oldIndex = active.id as number;
        const newIndex = over?.id as number;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }
  function updateTextBlock(index: number, value: string): void {
    setLayoutBlocks((prev) =>
      prev.map((block, i) =>
        i === index && 'content' in block ? { ...block, content: value } : block
      )
    );
  }
  function removeLayoutBlock(index: number): void {
    setLayoutBlocks((prev) => prev.filter((_, i) => i !== index));
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() =>
            setEditingProject({
              title: '',
              description: '',
              tech: [],
              category: 'Coding',
              status: 'draft',
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Project
        </button>
        <div className="flex items-center gap-3">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="All">All Categories</option>
            <option value="Coding">Coding</option>
            <option value="Localization">Game Localization</option>
            <option value="Photography">Photography</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="All">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={deleteSelected}
            disabled={!selectedProjects.length}
            className="text-sm bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredProjects.map((project) => (
    <div key={project.id} className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all relative">
      <div className="absolute top-2 left-2">
        <input
          type="checkbox"
          checked={selectedProjects.includes(project.id!)}
          onChange={() => toggleSelect(project.id!)}
          className="accent-blue-500"
        />
      </div>

      <div className="pl-6 pr-2 space-y-2">
        {/* 🔗 标题 + 状态标签 */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {project.status === 'published' ? (
              <a href={`/projects/${project.id}`} className="text-blue-700 underline">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded font-semibold uppercase ${
              project.status === 'published'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* 🕒 更新时间 */}
        <p className="text-sm text-gray-500">
          Last Updated:{' '}
          {typeof project.updatedAt?.toDate === 'function'
            ? project.updatedAt.toDate().toLocaleString()
            : 'N/A'}
        </p>

        {/* 🖼️ 封面图 */}
        {project.coverUrl && (
          <img
            src={project.coverUrl}
            alt="cover"
            className="w-full h-32 object-cover rounded-md border"
          />
        )}

        {/* 📂 分类 */}
        <p className="text-sm text-gray-600 flex items-center gap-1">
          {project.category === 'Coding' && '💻'}
          {project.category === 'Localization' && '🌍'}
          {project.category === 'Photography' && '📷'}
          <span className="font-medium">{project.category}</span>
        </p>

        {/* 🛠️ 技能标签 */}
        {project.tech?.length > 0 && (
          <p className="text-sm text-gray-600">
            🛠️ <span className="font-medium">Skills:</span> {project.tech.join(', ')}
          </p>
        )}

        {/* ✏️ 操作按钮 */}
        <div className="flex justify-end gap-4 mt-4 text-sm">
          <button
            onClick={() => setEditingProject(project)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              await deleteDoc(doc(db, 'projects', project.id!));
              fetchProjects();
            }}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
  {editingProject && (
    
    <div className="space-y-4">
      {/* 关闭按钮（右上角） */}
      <button
        onClick={() => setEditingProject(null)}
        className="absolute top-3 right-3 text-2xl font-bold text-gray-400 hover:text-black"
        aria-label="Close"
      >
        ×
      </button>

      {/* ESC 快捷键监听 */}
      <script suppressHydrationWarning>
        {`(() => {
          if (typeof window !== 'undefined') {
            window.onkeydown = (e) => {
              if (e.key === 'Escape') {
                document.querySelector('[data-modal-close]')?.click();
              }
            };
          }
        })()`}
      </script>
      {/* 标题与描述 */}
      <input
        type="text"
        placeholder="Title"
        value={editingProject.title || ''}
        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={editingProject.description || ''}
        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
        className="w-full border p-2 rounded"
      />

      {/* 技能标签 */}
      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={editingProject.tech?.join(', ') || ''}
        onChange={(e) =>
          setEditingProject({
            ...editingProject,
            tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
          })
        }
        className="w-full border p-2 rounded"
      />

      {/* 分类选择 */}
      <select
        value={editingProject.category}
        onChange={(e) =>
          setEditingProject({
            ...editingProject,
            category: e.target.value as Project['category'],
          })
        }
        className="w-full border p-2 rounded"
      >
        <option value="Coding">Coding</option>
        <option value="Localization">Game Localization</option>
        <option value="Photography">Photography</option>
      </select>

      {/* 当前时间信息显示 */}
      <div className="text-xs text-gray-500 flex justify-between">
        <span>
          Created:{' '}
          {editingProject.createdAt?.toDate
            ? editingProject.createdAt.toDate().toLocaleString()
            : '—'}
        </span>
        <span>
          Updated:{' '}
          {editingProject.updatedAt?.toDate
            ? editingProject.updatedAt.toDate().toLocaleString()
            : '—'}
        </span>
      </div>

      {/* 封面预览与上传 */}
      {editingProject.coverUrl && !coverFile && (
        <img src={editingProject.coverUrl} className="w-full rounded shadow mb-2" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      {/* 布局编辑区域 */}
      <div className="space-y-2">
        <h4 className="text-md font-medium">📐 Project Layout</h4>
        <div className="flex gap-2 flex-wrap">
        {['text', 'heading', 'quote', 'code', 'image', 'video', 'pdf'].map((type) => (
            <button
              key={type}
              onClick={() => handleAddLayoutBlock(type as Block['type'])}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              + {type.toUpperCase()}
            </button>
          ))}

        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={layoutBlocks.map((_, i) => i)} strategy={verticalListSortingStrategy}>
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
                          {block.type === 'pdf' && '📄 PDF'}
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
                      {block.type === 'pdf' && 'url' in block && (
                          <a
                            href={block.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 underline"
                          >
                            Open PDF
                          </a>
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

      {/* 保存操作 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setEditingProject(null)}
          data-modal-close
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
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
