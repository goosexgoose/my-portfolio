import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects | Kaiya Li's Portfolio",
  description: "Browse coding, localization, and photography projects completed by Kaiya Li."
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
