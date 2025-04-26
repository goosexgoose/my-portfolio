'use client';

export default function FilterControls({ searchTerm, setSearchTerm, filterCategory, setFilterCategory, sortBy, setSortBy }: any) {
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
        <option value="All">All Categories</option>
        <option value="Coding">Coding</option>
        <option value="Localization">Localization</option>
        <option value="Photography">Photography</option>
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
