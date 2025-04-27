'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function SidebarToggleButton({ sidebarOpen, setSidebarOpen }: Props) {
  return (
    <button
      aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="sm:hidden fixed bottom-4 left-4 z-50 bg-black text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:bg-gray-800"
    >
      {sidebarOpen ? (
        <XMarkIcon className="h-6 w-6" />
      ) : (
        <Bars3Icon className="h-6 w-6" />
      )}
    </button>
  );
}
