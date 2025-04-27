'use client';

import { useEffect } from 'react';

interface ProjectSidebarProps {
  categories: string[];
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  activeSection?: string | null;
}

export default function ProjectSidebar({
  categories,
  sidebarOpen = false,
  setSidebarOpen,
  activeSection,
}: ProjectSidebarProps) {
  // Enable smooth scroll behavior when clicking anchors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'fixed top-0 left-0 h-full bg-white p-6 z-50 sm:static' : 'hidden sm:flex sticky top-24'}
          flex-col gap-4 text-sm text-gray-700 font-medium pt-2 mt-5 w-40
          transition-transform duration-300 ease-in-out
        `}
      >

        <div className="space-y-4">
          {categories.map((cat) => {
            const isActive = activeSection === cat.toLowerCase();
            return (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className={`
                  relative block transition-all duration-300
                  ${isActive ? 'text-black font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-black' : 'text-gray-500'}
                  hover:text-black
                `}
                onClick={() => setSidebarOpen?.(false)}
              >
                {cat}
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}
