'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProjectList from './ProjectList';
import ProjectEditor from './ProjectEditor';
import ProjectEditModal from './ProjectEditModal'; 
import AdminCVUploader from './AdminCVUploader';

interface Project {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  category: 'Coding' | 'Localization' | 'Photography';
  layout?: any;
  status: 'draft' | 'published';
  createdAt?: any;
  updatedAt?: any;
  isRecentWork?: boolean;
}

export default function AdminTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'manage';

  const [tab, setTab] = useState(currentTab);
  const [editingProject, setEditingProject] = useState<Project | null>(null); // ✅ 新增编辑状态

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (newTab: string) => {
    router.push(`/admin?tab=${newTab}`);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <TabButton selected={tab === 'manage'} onClick={() => handleTabChange('manage')}>
          Manage Projects
        </TabButton>
        <TabButton selected={tab === 'create'} onClick={() => handleTabChange('create')}>
          Add New Project
        </TabButton>
        <TabButton selected={tab === 'cv'} onClick={() => handleTabChange('cv')}>
          Resume Management
        </TabButton>
      </div>

      {/* Content */}
      <div>
        {tab === 'manage' && (
          <>
            <ProjectList onEditProject={handleEditProject} />
            {editingProject && (
              <ProjectEditModal
                project={editingProject}
                onClose={() => setEditingProject(null)}
              />
            )}
          </>
        )}
        {tab === 'create' && <ProjectEditor />}
        {tab === 'cv' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Resume Management</h2>
            <AdminCVUploader />
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t ${selected ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
    >
      {children}
    </button>
  );
}
