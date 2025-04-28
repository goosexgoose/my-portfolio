import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Experience | Kaiya Li's Professional Journey",
  description: "Browse through Kaiya Li’s professional experiences in tech companies and freelance development projects."
};

export default function ExperiencesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
