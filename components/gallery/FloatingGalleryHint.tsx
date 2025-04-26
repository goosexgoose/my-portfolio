'use client';

import Link from 'next/link';

export default function FloatingGalleryHint() {
  return (
    <div className="mt-10 w-full text-center bg-indigo-50 rounded-lg p-4">
      <p className="text-gray-700 text-sm">
        For more works and an enhanced photography experience,{' '}
        <Link href="/gallery" className="text-indigo-600 font-semibold hover:underline">
          visit the Gallery →
        </Link>
      </p>
    </div>
  );
}
