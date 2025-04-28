import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gallery | Photography by Kaiya Li",
  description: "Explore a curated gallery of photography and creative works by Kaiya Li."
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
