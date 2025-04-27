'use client';

import { useState } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onConfirm: (altText: string) => void;
}

export default function ImageUploadModal({
  isOpen,
  imageUrl,
  onClose,
  onConfirm,
}: ImageUploadModalProps) {
  const [altText, setAltText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-none p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Add Caption for Image</h2>

        <img src={imageUrl} alt="preview" className="w-full max-h-60 object-contain rounded" />

        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Enter image caption (optional)"
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(altText);
              setAltText('');
            }}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}
