'use client';

import { useState, useEffect } from 'react';
import { Timestamp, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/editor/RichTextEditor';
import RichContentViewer from '@/components/editor/RichContentViewer';
import debounce from 'lodash.debounce';

export default function ProjectEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [layoutContent, setLayoutContent] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isRecentWork, setIsRecentWork] = useState(false);
  const [saving, setSaving] = useState(false); 

  const handleSave = async (status: 'draft' | 'published') => {
    if (saving) return;
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    if (!layoutContent) {
      toast.error('Please write some content.');
      return;
    }

    setSaving(true);
    try {
      const newDoc = doc(collection(db, 'projects'));
      await setDoc(newDoc, {
        title,
        description,
        category,
        tags,
        layout: layoutContent,
        isRecentWork: category === 'Photography' ? isRecentWork : false,
        status,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast.success(status === 'draft' ? 'Saved as draft.' : 'Published successfully.');

      setTitle('');
      setDescription('');
      setCategory('Coding');
      setTags([]);
      setNewTag('');
      setLayoutContent(null);
      setIsRecentWork(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  // Debounced auto-save
  useEffect(() => {
    if (!layoutContent) return;

    const autoSave = debounce(async () => {
      try {
        const tempDoc = doc(db, 'autosaves', 'new');
        await setDoc(tempDoc, {
          title,
          description,
          category,
          tags,
          layout: layoutContent,
          isRecentWork: category === 'Photography' ? isRecentWork : false,
          status: 'draft',
          updatedAt: Timestamp.now(),
        }, { merge: true });
        toast.success('Auto-saved');
      } catch (err) {
        console.error(err);
        toast.error('Auto-save failed');
      }
    }, 1500);

    autoSave();
    return () => autoSave.cancel();
  }, [layoutContent, title, description, category, tags, isRecentWork]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Coding">Coding</option>
          <option value="Localization">Localization</option>
          <option value="Photography">Photography</option>
        </select>

        {category === 'Photography' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecentWork}
              onChange={(e) => setIsRecentWork(e.target.checked)}
            />
            <label className="text-sm">Mark as Recent Work</label>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const tag = newTag.trim();
                  if (tag && !tags.includes(tag)) {
                    setTags(prev => [...prev, tag]);
                    setNewTag('');
                  }
                }
              }}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
              onClick={() => {
                const tag = newTag.trim();
                if (tag && !tags.includes(tag)) {
                  setTags(prev => [...prev, tag]);
                  setNewTag('');
                }
              }}
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
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

        <div className="border rounded p-4 bg-white">
          <h2 className="text-lg font-bold mb-2">Project Content</h2>
          <RichTextEditor
            value={layoutContent}
            onChange={setLayoutContent}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-6">
        <h2 className="text-xl font-bold">Preview</h2>
        <div className="p-4 border rounded shadow bg-white space-y-4">
          <h1 className="text-2xl font-bold">{title || 'Untitled Project'}</h1>
          <p className="text-gray-600">{description || 'No description yet.'}</p>
          {layoutContent ? (
            <RichContentViewer content={layoutContent} />
          ) : (
            <p className="text-gray-400">No content yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
