'use client';

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const categories = ['All', 'Coding', 'Localization', 'Photography'];

export default function FilterControls({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-full sm:w-auto"
      />

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="createdDesc">Created: Newest First</option>
        <option value="createdAsc">Created: Oldest First</option>
        <option value="titleAsc">Title: A–Z</option>
        <option value="titleDesc">Title: Z–A</option>
      </select>
    </div>
  );
}
