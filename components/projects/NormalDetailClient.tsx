'use client';

import RichContentViewer from '@/components/editor/RichContentViewer';

interface Props {
  layout: any;
}

export default function NormalDetailClient({ layout }: Props) {
  if (!layout) return null;

  return (
    <div className="pt-8">
      <RichContentViewer content={layout} />
    </div>
  );
}
