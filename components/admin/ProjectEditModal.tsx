'use client';

import { useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/editor/RichTextEditor';

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

export default function ProjectEditModal({ project, onClose, onSaveSuccess }: { project: Project, onClose: () => void, onSaveSuccess: () => void }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [category, setCategory] = useState<Project['category']>(project.category);
  const [tags, setTags] = useState<string[]>(project.tags || []);
  const [newTag, setNewTag] = useState('');
  const [layoutContent, setLayoutContent] = useState<any>(project.layout || null);
  const [isRecentWork, setIsRecentWork] = useState<boolean>(project.isRecentWork || false);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required.');
      return;
    }

    try {
      const docRef = doc(db, 'projects', project.id);

      await setDoc(docRef, {
        title,
        description,
        category,
        tags,
        layout: layoutContent,
        status,
        isRecentWork: category === 'Photography' ? isRecentWork : false,
        createdAt: project.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
      }, { merge: true });

      toast.success(status === 'draft' ? 'Saved as Draft.' : 'Published successfully.');
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update project.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full p-6 rounded shadow space-y-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold">Edit Project</h2>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full border p-2 rounded"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Short Description"
          className="w-full border p-2 rounded"
        />

        {/* Category */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Project['category'])}
          className="w-full border p-2 rounded"
        >
          <option value="Coding">Coding</option>
          <option value="Localization">Localization</option>
          <option value="Photography">Photography</option>
        </select>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (newTag.trim() && !tags.includes(newTag.trim())) {
                  setTags(prev => [...prev, newTag.trim()]);
                  setNewTag('');
                }
              }}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Recent Work (only for Photography) */}
        {category === 'Photography' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecentWork}
              onChange={e => setIsRecentWork(e.target.checked)}
            />
            <label className="text-sm">Mark as Recent Work</label>
          </div>
        )}

        {/* Rich Text Editor */}
        <div className="border p-2 rounded">
          <h3 className="font-semibold mb-2">Project Content</h3>
          <RichTextEditor
            value={layoutContent}
            onChange={setLayoutContent}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={() => handleSave('draft')} className="px-4 py-2 bg-gray-600 text-white rounded">Save as Draft</button>
          <button onClick={() => handleSave('published')} className="px-4 py-2 bg-black text-white rounded">Publish</button>
        </div>
      </div>
    </div>
  );
}
