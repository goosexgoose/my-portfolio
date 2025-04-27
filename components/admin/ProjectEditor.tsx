'use client';

import { useState } from 'react';
import { Timestamp, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/editor/RichTextEditor';
import RichContentViewer from '@/components/editor/RichContentViewer';

export default function ProjectEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [layoutContent, setLayoutContent] = useState<any>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isRecentWork, setIsRecentWork] = useState(false);

  const [saving, setSaving] = useState(false); // ✅ NEW

  const handleSave = async (status: 'draft' | 'published') => {
    if (saving) return; // ✅ Prevent double-click

    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    if (!layoutContent) {
      toast.error('Please write some content.');
      return;
    }

    setSaving(true); // ✅ Start loading
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

      // Reset form
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
      setSaving(false); // ✅ End loading
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: Editor */}
      <div className="flex-1 space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Description */}
        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Coding">Coding</option>
          <option value="Localization">Localization</option>
          <option value="Photography">Photography</option>
        </select>

        {/* isRecentWork checkbox */}
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

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
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
              <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="border rounded p-4 bg-white">
          <h2 className="text-lg font-bold mb-2">Project Content</h2>
          <RichTextEditor
            value={layoutContent}
            onChange={setLayoutContent}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving} // ✅ Disable during saving
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving} // ✅ Disable during saving
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="w-full lg:w-1/2 space-y-6">
        <h2 className="text-xl font-bold">Preview</h2>
        <div className="p-4 border rounded shadow bg-white space-y-4">
          {/* Title Preview */}
          <h1 className="text-2xl font-bold">{title || 'Untitled Project'}</h1>

          {/* Description Preview */}
          <p className="text-gray-600">{description || 'No description yet.'}</p>

          {/* Rich Text Content Preview */}
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
