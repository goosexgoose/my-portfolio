'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl relative animate-fadeIn">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} aria-label="Close modal">
              <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
