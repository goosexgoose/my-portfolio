'use client';

interface ProjectSidebarProps {
  categories: string[];
  sidebarOpen?: boolean; // Optional now, doesn't affect rendering
}

export default function ProjectSidebar({ categories }: ProjectSidebarProps) {
  return (
    <aside className="hidden sm:flex flex-col gap-4 text-sm text-gray-700 font-medium pt-2 mt-5 sticky top-20 w-40">
      <div className="space-y-4">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#${cat.toLowerCase()}`}
            className="block text-gray-700 hover:text-black hover:underline transition"
          >
            {cat}
          </a>
        ))}
      </div>
    </aside>
  );
}
