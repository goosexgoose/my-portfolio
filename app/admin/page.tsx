'use client';

import AdminTabs from '@/components/admin/AdminTabs';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react'; 

export default function AdminPage() {
  console.log('Admin page rendered');

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage projects, resumes, and other content here.</p>
        </header>

        {/* Admin Tabs */}
        <main>
          <Suspense fallback={<div>Loading Admin Tabs...</div>}>
            <AdminTabs />
          </Suspense>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
