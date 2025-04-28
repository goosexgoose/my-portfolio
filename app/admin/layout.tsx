import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin | Kaiya Li's Admin Panel",
  description: "Admin dashboard for managing portfolio projects, user interactions, and content updates."
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
