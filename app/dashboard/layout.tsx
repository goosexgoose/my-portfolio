import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "User Dashboard | Kaiya Li's Admin Panel",
  description: "Manage user interactions, content updates, and more.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
