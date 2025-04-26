'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

export default function SidebarToggleButton({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="sm:hidden fixed bottom-4 left-4 z-50 bg-black text-white rounded-full p-2 shadow-lg"
    >
      {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
    </button>
  );
}
